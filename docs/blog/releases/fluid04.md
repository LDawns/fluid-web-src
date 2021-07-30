---
sidebarDepth: 0
---

# Fluid 0.4 new release: supports data preheating and optimizes small file  scenarios

**Guide reading:** in order to solve the problems of high delay of data access, difficult joint analysis and multi-dimensional management in the separation scenario of data intensive applications such as big data and AI in cloud primary computing storage separation scenario, pasalab, Alibaba and alluxio of Nanjing University jointly launched open source project fluid in September 2020.

Recently, fluid 0.4 version was officially released, with four important functions added, namely:

- Data load customization provides easy to use and customizable data preheating capability

- Enhance the support capability of large amount of small file data sets, and expand the support scenarios of fluid for AI applications

- Open HDFS file system compatible interface, support data access of spark and other frameworks

- Support mixed deployment of multiple datasets and single nodes, and adapt to the shared cluster environment in the production environment

**Fluid project address ** : https://github.com/fluid-cloudnative/fluid

And fluid 0.3 Similar to the above functions, the development requirements of the above functions are also from the production actual feedback of many community users. In addition, fluid v0.4 has also carried out some bug fixes and document updates. Welcome to experience fluid v0.4! Thank you for the community partners who have contributed to this version. In the next version function iteration, we will continue to pay close attention to and adopt community suggestions, promote the development of fluid project, and look forward to hearing more feedback from you!

The following is a further introduction to the release features of this new version.

## Support active data preheating

Data preheating is a common optimization method in AI application model training. Data preheating refers to pulling the data needed by the application from the remote storage system to the local computing cluster before the application runs for later application operation **Data preheating is a sequential and regular parallel data reading mode, which avoids the unnecessary communication overhead caused by random data reading when data intensive applications consume data of remote storage system directly.**

Therefore, in fluid 0.4, **we implemented a new kubernetes custom resource dataload, which provides the user with a declarative API interface in the way of kubernetes resources to control the data preheating related behaviors** . A simple example of dataload custom resources is as follows:

```yaml
apiVersion: data.fluid.io/v1alpha1
kind: DataLoad
metadata:
	name: imagenet-dataload
spec:
	dataset:
		name: imagenet
		namespace: default

```

In addition, with a small amount of additional configuration, dataload can also realize many customizable functions such as subdirectory loading, cache replica quantity control, metadata synchronization, etc. for more details related to the use of dataload, please refer to sample document on GitHub.

The demo video on the use and optimization of dataload is as follows:

[![ 04-demo]( https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/dataWarmup.jfif )]( http://tbm-auth.alicdn.com/e99361edd833010b/dSVC55aoHBRio4co9aD/ZufLSdTxRmFes54tZ1a_ 302459823704_ hd_ hq.mp4? auth_ key=1627303642-0-0-a8575676f7131c06489a29e302541323)

## Enhance the support ability of large amount of small file data sets

Fluid is an efficient support platform for data intensive applications in cloud native environment. Therefore, we have been closely following the applicability of the data set support capability provided by fluid in different scenarios. Before fluid 0.4, fluid has provided a series of data set support capabilities such as abstraction, management, acceleration, observability, etc., however, the above capabilities are still very basic in the context of large amount of small files based on the feedback of community members.

Considering the universality of large-scale small file data sets in real production environment, especially AI application scenarios, we have made in-depth research on the problems brought by large-scale small files, and put forward solutions such as **asynchronous metadata loading query**, **streaming data processing**  and so on , which are all integrated into fluid 0.4 version at present, To enhance fluid's support for large small file data sets 

**The following is the performance comparison assessment results of fluid after optimizing in the 4million small file scenario using the alluxito runtime** :

|                                    | **Fluid 0.3** | **Fluid 0.4** |
| ---------------------------------- | ------------- | ------------- |
| **dataset initialization**         | 60 min        | 22 min        |
| **8 thread parallel data reading** | 407 min       | 29 min        |
| **deep learning model training**   | 6.5 hours     | 45 min        |

Storage management of large amount of small files is a difficult problem that many storage systems will encounter. In the subsequent versions, we will continue to pay attention to this scenario and the problems it brings.

## Convenient big data computing framework such as spark to provide data access support

Besides AI applications, fluid 0.4 also supports big data applications such as spark to run on it. By exposing the Hadoop file system compatible interface (HCFs) of the allouxio distributed cache engine to users, the data analysis application written by Hadoop MapReduce, Apache spark and other big data computing frameworks can be directly run on fluid without modifying the application code, and enjoy the ability of distributed cache acceleration provided by fluid . 

For more details on accessing data through the HCFs interface, refer to sample documentation on GitHub.

## Mixed deployment of multiple data sets and single node

In the real production environment, users will train multiple tasks on GPU nodes in kubernetes cluster to use multiple datasets. Before fluid 0.4, single node cannot deploy multiple data sets at the same time. Therefore, if multiple users expect to access the required data sets at the same node at the same time, A user's dataset cannot be created.

In fluid 0.4, we added the ability of multi dataset and single node mixed deployment for fluid, which means that as long as the resources on the node are sufficient, the conflict of deployment of multiple datasets from different users will no longer occur, which will make fluid more suitable for the needs of the actual production environment. On the other hand, hybrid deployment can effectively utilize idle resources, increase the utilization rate of cluster resources of each node in the cluster, and further improve the cost and benefit brought by fluid.

For a brief introduction to mixed deployment of multiple datasets and single nodes, refer to sample document on GitHub.

## Thank

- Xu Zhihao (pasalab, Nanjing University) contribution to supporting small file scenarios and data preheating functions

- Xiefeng (cloud Zhisheng) for the development of mixed deployment function and scenario verification of multiple data sets and single node

- Qiu Lingwei (Chinatelecom) contributed to fluid architecture split, he split the runtime and dataset controller, and supported the parallel evolution of the two components in the future

## Summary

Fluid 0.4 will continue to address the problems and requirements feedback from community users in the actual production environment, expand the applicability of fluid in various scenarios and improve the user experience:

- Firstly, the optimization of the support capability of large and small file data sets enables fluid to better deal with different use scenarios;

- Secondly, the new data load customization resources provide a simple data preheating solution for users;

- Furthermore, the support for data access of big data applications such as spark enables fluid to provide support for different types of data intensive applications;

- Finally, the mixed deployment of multiple datasets makes fluid more suitable for the actual production environment.

If you have any questions or suggestions, please join the nail exchange group to participate in and discuss:



<FluidCommunity/>



## Introduction to the author

**Dr. Gu Rong** is an associate researcher of Computer Department of Nanjing University, and has published more than 20 papers in the frontier periodical meetings in TPDS, ICDE, jpdc, IPDPS, ICPP and other fields. He presided over several projects on the National Natural Science Foundation (NSFC) and youth projects, and a number of special projects funded by China Postdoctoral Science Fund. The research results have been applied to Alibaba, Baidu, and Baidu Byteco, Sinopec, Huatai Securities and open source projects Apache spark and alluxio won the first prize of Jiangsu Science and technology in 2018, the youth science and technology award of Jiangsu computer society in 2019, and served as member of the system software special committee of China Computer Society / communication member of the special committee of big data, Secretary General of the big data special committee of Jiangsu computer society Fluid Open Source Project Co foundation, PMC member of the alluxio open source project.
