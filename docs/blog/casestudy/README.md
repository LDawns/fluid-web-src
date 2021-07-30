---
sidebarDepth: 0
---
# Weibo：With Fluid, the training time of distributed deep learning training is reduced from 2 weeks to 16 hours

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/ib46qAHicOxDqY77Y6cxhktrrmcsO8Ow3o7e80bwXx7jjRP1ibxsOZxOpLHcMrRQgOp1221G1CWUwYzZVS5VtpGQg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

**Guide:** deep learning platform plays an important role in weibo social business. Under the framework of separation of computing and storage, weibo deep learning platform has the problem of low performance in data access and scheduling. This paper will introduce a new framework based on fluid (including Jindo runtime) which is designed and implemented in weibo. It significantly improves the performance and stability of massive small file scene model training. The multi machine and multi card distributed training scene can increase the speed of model training by 18 times.

## Background

Sina Weibo is the largest social media platform in China. Hundreds of millions of content are generated every day and spread on trillions of social networks. The following figure shows the business ecology of weibo. Through the production and dissemination of high-quality content by high-quality users, ordinary users consume these content, and then pay attention to their favorite bloggers, establish connections, and form a closed-loop ecology.


![图片](https://mmbiz.qpic.cn/mmbiz_jpg/yvBJb5IiafvkHabMamicdayFk46plcqxWVFMXFiaOFBYk1SibcjMoPCEF2oWV1vm4pWcrvicnhFYPn3UJSYX94E54fg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

The main function of weibo machine learning platform is to make the whole process flow more efficiently and smoothly: by understanding high-quality content, building user portraits, pushing high-quality content that users are interested in to users, so that they can interact with content producers, and then stimulate producers to produce more and better content, so as to achieve a win-win situation for information consumers and information producers. As multimedia content becomes the mainstream, deep learning technology becomes more important. From the understanding of multimedia content to the optimization of CTR task, it is inseparable from the support of deep learning technology.
## Large scale deep learning model training challenge
With the extensive use of deep learning in weibo business scenarios, weibo deep learning platform plays a very core role. The platform adopts the architecture of separation of storage and computing, which decouples computing resources from storage resources, realizes flexible resource allocation and convenient storage expansion, and reduces storage cost.

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/yvBJb5IiafvkHabMamicdayFk46plcqxWV4uBxH1HjfhNJ4esauPpYZOQOxKqPf1iabicevKEqcRd0Hwy4icEatsDPw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

However, this architecture also brings some challenges, among which the key problems are data access performance and stability

1. **computing storage separation architecture leads to high delay of data access and slow training**: the deep learning task (image or voice model) used by the business team will access a large number of small files. Experiments show that the performance of HDFS reading massive small files is nearly ten times or even a hundred times better than that of local reading.

2. **the data cache of kubernetes scheduler is not aware, and the same data source runs for many times, and the access is still slow**: the same model and different super parameters; Fine tuning model, the same input; Deep learning tasks such as automl will repeatedly access the same data, resulting in reusable data cache. However, because the native kubernetes scheduler can't sense the cache, the result of application scheduling is not good, the cache can't be reused, and the performance can't be improved.

3. **most deep learning frameworks do not support HDFS interface, which makes development difficult**: for example, pytorch, mxnet and other frameworks only support POSIX protocol interface, and HDFS interface needs additional docking development. Therefore, it is necessary to support POSIX interface in model development stage and HDFS interface in model training stage at the same time, and introduce the complexity of model code adapting to different storage.

4. **HDFS has become the bottleneck of data concurrent access, which poses a great challenge to the stability**: hundreds of GPU machines on the weibo machine learning platform will access HDFS cluster at the same time, and the IO pressure of deep learning training is relatively high, so HDFS service has become a single point of performance, which poses a huge challenge to the performance and stability of HDFS. Once one task slows down the HDFS system, other training tasks will also be affected. Moreover, once HDFS fails to work, the whole training cluster will also be affected.

Through the monitoring and analysis of weibo deep learning platform, we find that: on the one hand, due to IO performance problems, GPU and other expensive computing resources can not be fully utilized; On the other hand, we also find that the water level of the memory and local hard disk in the cluster is very low, and the margin is large and stable. This is because most deep learning tasks do not use the local disk, and the memory utilization rate is not high. Therefore, if we can make full use of the cluster's own memory and disk resources to accelerate data access, it will be a better solution.

## Fluid + jindoruntime: providing efficient support for weibo deep learning platform

In order to better meet the computing needs of large-scale deep learning model training, we need to achieve better data locality effect. Therefore, we hope to achieve the following goals:

1. Computing can make full use of local access data, so that the data does not need to be read repeatedly through the network, accelerating the speed of deep learning model training and improving the GPU utilization of the cluster.

2. Reduce the load pressure of HDFS, reduce the data access delay and improve the availability of HDFS through the application of local reading of some data.

3. Make full use of the cache node advantage of hot data set, and schedule tasks intelligently to the data cache node without user perception. Let the commonly used model training program faster and faster.

4. Read data through POSIX interface, so that there is no need to use different data access interfaces in the model development and training stages, reducing the cost of developing deep learning model program.

In order to achieve the above goal, we are eager to find software with distributed cache acceleration capability on kubernetes. Fortunately, we found that the CNCF sandbox project fluid can meet our demands. Therefore, we designed a new architecture scheme based on fluid. After verification and comparison, we chose Jindo runtime as the acceleration runtime.

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/yvBJb5IiafvkHabMamicdayFk46plcqxWV60eicm0QKcRGKCzKbJS1Nvan7GzicGOkME24ibTEAAhtnosOAqTl8olFA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

### Introduction to architecture components

#### Fluid
Fluid[1] is an extensible distributed data choreography and acceleration system running on kubernetes. It solves the problems of high data access delay, difficult joint analysis of multiple data sources, and complex data application process by data choreography and application scheduling.
#### JindoRuntime
Jindoruntied [2] is an implementation of fluid distributed cache runtime, which is based on jindofs distributed cache acceleration engine. Jindofs is a big data storage optimization engine developed by Alibaba cloud EMR team. It is fully compatible with Hadoop file system interface, bringing customers more flexible and efficient computing and storage solutions. Jindo runtime uses Jindo FS cache mode to access and cache remote files, and supports access and cache acceleration of OSS, HDFS, standard S3 protocol and other storage products. The process of using and deploying jindoruntime on fluid is simple, compatible with native k8s environment, and can be used out of the box. In depth, it combines the storage characteristics of objects, uses the Navite framework to optimize the performance, and supports data security functions on the cloud such as confidentiality free and checksum verification.

### Reasons for using jindoruntime based fluid

1. Fluid can arrange data sets in kubernetes cluster to realize the co location of data and calculation, and provide persistent volume claim interface to realize the seamless docking of applications on kubernetes. At the same time, jindoruntime provides the ability to access and cache data on HDFS, and can be implemented by using the POSIX file system interface of fuse. It can easily use massive files on HDFS like a local disk. Deep learning training tools such as Python can use the POSIX file interface to read training data.

2. Aiming at the remote data access performance of massive small files, Jindo runtime optimizes the data organization management and access performance of small files, which can provide efficient small file access performance, which is much higher than that of HDFS.

3. Provide metadata and data distributed hierarchical cache, as well as efficient small file retrieval.

4. Provide data preheating mechanism to avoid data access competition caused by pulling data at training time.

5. The file data is organized by slab allocation to make efficient use of cache space.

6. Through the data aware scheduling capability of fluid, users can place tasks to the nodes with cached data without knowing the cache node information, so as to maximize the advantage of data access performance.

7. Different cache strategies and storage methods are provided for large files and small files. It has good adaptability for small file AI training scenarios, and does not need user configuration.

  

### Landing practice

1. **choose the right cache node**: using Jindo runtime can get better data local performance. In the actual production, we also found that not all nodes have better cache performance. The reason is that the disk and network IO performance of some nodes are not very good. At this time, we need to be able to select some high-capacity disk and better network nodes as far as possible. Fluid supports the schedulability of datasets, in other words, the schedulability of cache nodes. We schedule the cache nodes of datasets by specifying the nodeaffinity of datasets, so as to ensure that the cache nodes can provide cache services efficiently.

2. **specify master scheduling policy**: jindoruntime consists of three parts: Master / worker / fuse. The master is responsible for the brain of the cluster and the management of metadata and cluster cache. Therefore, the master node must have strong reliability and recovery speed. In the production process, we found that without using multiple masters, a single master also has strong stability and fault recovery speed. The important factor affecting the stability of the master node is the stability of the host, such as full disk of the host, communication failure, etc, Based on this, we use nodeselector to select the host with better performance as the environment of the master container to further ensure the stability of the master environment.

  3. **timing data preheating**: an important step before training is to preheat metadata and data. Fluid provides the form of CRD for metadata and data caching. Caching metadata and data of training files to local before training can greatly accelerate the training speed. However, the training files stored in HDFS are updated once a day, so we need to carry out the data warm-up process periodically and regularly. Based on the CRD of dataload, we use the form of cronjob to schedule periodically, so that we can complete the preparation of metadata and data before each training, so as to carry out efficient training. Of course, Jindo runtime itself supports incremental synchronization, so you only need to update the changed files each time, which greatly speeds up the data preheating.

### Performance test plan

In order to verify the overall effect of the above scheme, we verify it from different angles of stability and performance. Here we focus on the performance test scheme. The training models are all video understanding models based on mmaction, using rawframes_ The train mode is a training dataset experiment with 400W images. The data is extracted from 40W video extracted from real business scenes, and 10 images are extracted from each scene. Due to different video clarity, the size of each image varies from a few KB to a dozen m, with a total size of 780g, and each cache node provides 300g of cache space; At the same time, according to the experience, the convergence of the model can be achieved at about 50 epoch.

When we adjust the test video data to 100W, the total data size is 2T. Due to the large amount of data and long delay, the HDFS interface can not work at all; Fluid + Jindo runtime can meet the needs of business.

The test process is to warm up the data through fluid jindoruntime, and then conduct model training.

### Performance test results

Combined with the fluid + jindoruntime scheme, we have achieved a very obvious improvement in training speed under the premise of data preheating. As can be seen from the following figure: in the scenario of 3 computers and 12 cards, we found that experiments based on HDFS interface reading data often break down due to network communication and other problems, resulting in the experiment can not be completed. After adding exception handling, we found that the experiment can not be completed, The waiting time between workers is longer, so increasing the number of cards does not increase the training speed, but will slow down. It can be observed that the overall training speed of 1 machine with 8 cards and 3 machine with 12 cards is basically the same, and the capacity of computing resources is expanded. Through the new scheme, we find that compared with HDFS interface, 4 cards on 1 computer can get 5 times of acceleration, 8 cards on 2 computers can get 9 times of acceleration, and 12 cards on 3 computers can get 18 times of acceleration.

![图片](https://mmbiz.qpic.cn/mmbiz_png/ZBjVrHIdkOl09NSB4uEVwuic2AKUgLBx1puEyFKic3NhkAyI0ADkLicyaCWRibWptawoxSkmfPbTZz0lhCw7nDkIdQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

由于训练的速度和稳定性得到了保障，端到端的模型训练时间也得到了显著的提升，训练总时长由原来的 389 小时（16 天）缩短到了 16 小时。

![图片](https://mmbiz.qpic.cn/mmbiz_png/ZBjVrHIdkOl09NSB4uEVwuic2AKUgLBx1OTric5mzlWicXmCu498ORKicuNMtTaT2pRHDjYtuDbFHp7fMrMEzrzuKQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## Conclusion: from two weeks to 16 hours training speed jump

The integration of fluid + Jindo runtime significantly improves the performance and stability of small file scene model training. In the case of multi machine and multi card distributed training, the speed of model training can be increased by 18 times; Reduced the training that used to take two weeks to 16 hours. Shorter training time and less HDFS pressure also improved the stability of training tasks, and the success rate of training increased from 37.1% to 98.3%. At present, the amount of data in our production environment is 4tb, and with the continuous iteration, the amount of data continues to grow.

weibo AI training scenarios have high performance requirements for data reading, and massive small files are also very sensitive to access latency. Through the caching capability of Jindo runtime, the data on big data storage system can be effectively cached and accelerated, providing stable and reliable data access performance with high throughput and low latency, At the same time, it can effectively relieve the pressure on the back-end storage system and ensure the stability of the back-end storage. Combined with its own specific scenarios, optimizing small file reading and caching can not only relieve the IO pressure of HDFS cluster, but also greatly improve the training efficiency.

## Prospect

At present, fluid + jindoruntime is more like a trump card, which is used to speed up small file scenarios, while unconventional weapons speed up and optimize all data sets. We expect to use elastic data acceleration as the differentiation ability of weibo deep learning platform, so as to improve the overall training task speed and the utilization of computing resources; On the other hand, it also helps the community to evolve and help more developers. Specifically:

- Support timed tasks, support dynamic expansion and reduction
- With the improvement of data preheating performance and the provision of metadata backup mechanism, the ability to quickly rebuild data sets is realized
- Provide performance monitoring console
- Support high availability and image upgrade of runtime metadata
- Support the life cycle management of multiple data sets in large-scale k8s cluster
## Thank you

Thanks to Chenshan, Yangli and CHEYANG of the container team of Alibaba cloud jindofs for their great help in the whole scheme design and optimization process. They have given the data acceleration capability to the existing applications without any application transformation; At the same time, it also provides timely and professional support for the requirements and problems in the test and production environment.