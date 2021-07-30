---
sidebarDepth: 0
---

# Fluid gives data elasticity a pair of invisible wings - Custom elastic expansion

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/yvBJb5IiafvlDU5Loo3wZD09D99qEvVsfnM1QfRV6eHamufkUACPTD6YjsVxtcN2EtJLo6tY2nI9odgMEm5HoGA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

**Introduction:** elastic scaling is one of the core capabilities of kubernetes, but it has always been carried out around this stateless application load. Fluid provides the elastic scalability of distributed cache, which can flexibly expand and shrink data cache. It provides performance indicators such as cache space and existing cache proportion based on runtime, and provides data cache scalability on demand in combination with its capacity to expand and shrink runtime resources.

## Background

As more and more data intensive applications such as big data and AI begin to be deployed and run in kubernetes environment, the differences between the design concept of data intensive application computing framework and the original flexible application layout of cloud lead to data access and computing bottlenecks. The cloud native data orchestration engine fluid provides the ability to accelerate data access for applications through the abstraction of data sets, the use of distributed cache technology and the combination of scheduler.

![图片](https://mmbiz.qpic.cn/mmbiz_png/yvBJb5IiafvlDU5Loo3wZD09D99qEvVsfDlDfPoLHK1CjzH8l4ibjQfKHOH5biazdrI7ZyemuhkNeSFqhiaYcUkt2A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

Elastic scaling is one of the core capabilities of kubernetes, but it has always been carried out around this stateless application load. Fluid provides the elastic scalability of distributed cache, which can flexibly expand and shrink data cache. It provides performance indicators such as cache space and existing cache proportion based on runtime, and provides data cache scalability on demand in combination with its capacity to expand and shrink runtime resources.

This capability is very important for big data applications in the Internet scenario, because most big data applications are realized through end-to-end pipeline. The pipeline includes the following steps:

1. **data extraction**: use spark, MapReduce and other big data technologies to preprocess the original data.

2. **model training**: use the feature data generated in the first stage to train the machine learning model and generate the corresponding model.

3. **model evaluation**: evaluate and test the model generated in the second stage through the test set or verification set.

4. **model reasoning**: the model verified in the third stage is finally pushed online to provide reasoning services for the business.

![图片](https://mmbiz.qpic.cn/mmbiz_png/yvBJb5IiafvlDU5Loo3wZD09D99qEvVsfQY5EF2q2pwqTnjeXBsfEnvaDsZ6ubMeHb6PEI3Ln79xWUwHVBaz9pw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

It can be seen that the end-to-end pipeline will contain many different types of computing tasks. For each computing task, there will be an appropriate professional system to handle it in practice (tensorflow, pytorch, spark, PRESTO); However, these systems are independent of each other, and usually transfer data from one stage to the next with the help of external file system. However, frequent use of file system for data exchange will bring a lot of I / O overhead and often become the bottleneck of the whole workflow.

Fluid is very suitable for this scenario. The user can create a dataset object, which has the ability to disperse and cache data to the kubernetes computing node as the medium for data exchange. In this way, remote data writing and reading are avoided and the efficiency of data use is improved. However, the problem here is the resource estimation and reservation of temporary data cache. Before data production and consumption, accurate data volume estimation is difficult to meet. Too high estimation will lead to waste of resource reservation, and too low estimation will increase the possibility of data write failure. Or expand and shrink the capacity on demand, which is more user-friendly. We hope to achieve the use effect similar to page cache. This layer is transparent to end users, but its cache acceleration effect is real.

By customizing the HPA mechanism, we introduce cache elasticity and scalability through fluid. When the buffer capacity reaches a certain elastic ratio, the expansion of the existing buffer space will be triggered. For example, set the trigger condition that the proportion of cache space exceeds 75%. At this time, the total cache space is 10g. When the data has occupied 8g cache space, the capacity expansion mechanism will be triggered.

Let's use an example to help you experience fluid's automatic capacity expansion and contraction capability.

## Preconditions

It is recommended to use kubernetes 1.18 or above, because HPA cannot customize the expansion and contraction strategy before 1.18, which is implemented through hard coding. After 1.18, you can customize the expansion and contraction strategy, for example, you can define the cooling time after a capacity expansion.

## Specific steps

### 1. Install JQ tools to facilitate JSON parsing.

In this example, the operating system we use is CentOS. You can install JQ through yum.

```bash
yum install -y jq
```

### 2. Download and install the latest version of fluid.

```bash
git clone https://github.com/fluid-cloudnative/fluid.git
cd fluid/charts
kubectl create ns fluid-system
helm install fluid fluid
```

### 3. Deploy or configure Prometheus

Here, the metrics exposed by the cache engine of alluxioruntime are collected by Prometheus. If there is no Prometheus in the cluster:

```bash
$ cd fluid
$ kubectl apply -f integration/prometheus/prometheus.yaml
```

If there is Prometheus in the cluster, you can write the following configuration to the Prometheus configuration file:

```yaml
scrape_configs:
  - job_name: 'alluxio runtime'
    metrics_path: /metrics/prometheus
    kubernetes_sd_configs:
      - role: endpoints
    relabel_configs:
    - source_labels: [__meta_kubernetes_service_label_monitor]
      regex: alluxio_runtime_metrics
      action: keep
    - source_labels: [__meta_kubernetes_endpoint_port_name]
      regex: web
      action: keep
    - source_labels: [__meta_kubernetes_namespace]
      target_label: namespace
      replacement: $1
      action: replace
    - source_labels: [__meta_kubernetes_service_label_release]
      target_label: fluid_runtime
      replacement: $1
      action: replace
    - source_labels: [__meta_kubernetes_endpoint_address_target_name]
      target_label: pod
      replacement: $1
      action: replace
```

### 4. Verify that Prometheus is installed successfully

```bash
$ kubectl get ep -n kube-system  prometheus-svc
NAME             ENDPOINTS        AGE
prometheus-svc   10.76.0.2:9090   6m49s
$ kubectl get svc -n kube-system prometheus-svc
NAME             TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
prometheus-svc   NodePort   172.16.135.24   <none>        9090:32114/TCP   2m7s
```

If you want to visualize the monitoring indicators, you can install grafana to verify the monitoring data. Refer to the documentation for specific operations.

![图片](https://mmbiz.qpic.cn/mmbiz_png/yvBJb5IiafvlDU5Loo3wZD09D99qEvVsftc0haAXmMLkBBagySeMURLh6Re8oT37J27Z1cr0hElvDia9wDWLqiaow/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

### 5. Deploy metrics server

Check whether the cluster includes metrics server. If you execute 'kubectl top node' and have correct output to display memory and CPU, the cluster's metrics server is configured correctly.

```bash
kubectl top node
NAME                       CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
192.168.1.204   93m          2%     1455Mi          10%
192.168.1.205   125m         3%     1925Mi          13%
192.168.1.206   96m          2%     1689Mi          11%
```

Otherwise, manually execute the following command:

```bash
kubectl create -f integration/metrics-server
```

### 6. Deploy the custom metrics API component.

To extend based on custom metrics, you need to have two components:

- **the first component** is to collect metrics from the application and store them in the Prometheus time series database.

- **the second component** uses the collected metrics to extend the kubernetes custom metrics API, namely k8s Prometheus adapter.

The first component is deployed in step 3. Next, deploy the second component.

If the custom metrics API has been configured, add the configuration related to dataset in the configmap configuration of the adapter:

```yaml

apiVersion: v1
kind: ConfigMap
metadata:
  name: adapter-config
  namespace: monitoring
data:
  config.yaml: |
   	rules: 
  	- seriesQuery: '{__name__=~"Cluster_(CapacityTotal|CapacityUsed)",fluid_runtime!="",instance!="",job="alluxio runtime",namespace!="",pod!=""}'
      seriesFilters:
      - is: ^Cluster_(CapacityTotal|CapacityUsed)$
      resources:
        overrides:
          namespace:
            resource: namespace
          pod:
            resource: pods
          fluid_runtime:
            resource: datasets
      name:
        matches: "^(.*)"
        as: "capacity_used_rate"
      metricsQuery: ceil(Cluster_CapacityUsed{<<.LabelMatchers>>}*100/(Cluster_CapacityTotal{<<.LabelMatchers>>}))
```

Otherwise, manually execute the following command:

```bash
kubectl create -f integration/custom-metrics-api/namespace.yaml
kubectl create -f integration/custom-metrics-api
```



>Note: since the custom metrics API connects the access address of the Prometheus in the cluster, please replace the Prometheus URL with the Prometheus address you really use.
Check custom indicators:

```bash

$ kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1" | jq
{
  "kind": "APIResourceList",
  "apiVersion": "v1",
  "groupVersion": "custom.metrics.k8s.io/v1beta1",
  "resources": [
    {
      "name": "pods/capacity_used_rate",
      "singularName": "",
      "namespaced": true,
      "kind": "MetricValueList",
      "verbs": [
        "get"
      ]
    },
    {
      "name": "datasets.data.fluid.io/capacity_used_rate",
      "singularName": "",
      "namespaced": true,
      "kind": "MetricValueList",
      "verbs": [
        "get"
      ]
    },
    {
      "name": "namespaces/capacity_used_rate",
      "singularName": "",
      "namespaced": false,
      "kind": "MetricValueList",
      "verbs": [
        "get"
      ]
    }
  ]
}
```
### 7. Submit the dataset used for the test

```bash
$ cat<<EOF >dataset.yamlapiVersion: data.fluid.io/v1alpha1kind: Datasetmetadata:  name: sparkspec:  mounts:    - mountPoint: https://mirrors.bit.edu.cn/apache/spark/      name: spark---apiVersion: data.fluid.io/v1alpha1kind: AlluxioRuntimemetadata:  name: sparkspec:  replicas: 1  tieredstore:    levels:      - mediumtype: MEM        path: /dev/shm        quota: 1Gi        high: "0.99"        low: "0.7"  properties:    alluxio.user.streaming.data.timeout: 300secEOF$ kubectl create -f dataset.yamldataset.data.fluid.io/spark createdalluxioruntime.data.fluid.io/spark created
```
### 8. Check whether the dataset is available

It can be seen that the total amount of data in this dataset is 2.71gib. At present, the number of cache nodes provided by fluid is 1, and the maximum cache capacity that can be provided is 1gib. At this time, the amount of cached data cannot meet the demand.

```bash
$ kubectl get dataset
NAME    UFS TOTAL SIZE   CACHED   CACHE CAPACITY   CACHED PERCENTAGE   PHASE   AGE
spark   2.71GiB          0.00B    1.00GiB          0.0%                Bound   7m38s
```
### 9. When the dataset is available, check whether the monitoring indicators can be obtained from the custom metrics API

```bash
kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/datasets.data.fluid.io/*/capacity_used_rate" | jq
{
  "kind": "MetricValueList",
  "apiVersion": "custom.metrics.k8s.io/v1beta1",
  "metadata": {
    "selfLink": "/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/datasets.data.fluid.io/%2A/capacity_used_rate"
  },
  "items": [
    {
      "describedObject": {
        "kind": "Dataset",
        "namespace": "default",
        "name": "spark",
        "apiVersion": "data.fluid.io/v1alpha1"
      },
      "metricName": "capacity_used_rate",
      "timestamp": "2021-04-04T07:24:52Z",
      "value": "0"
    }
  ]
}
```
### 10. Create HPA task

```bash

$ cat<<EOF > hpa.yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: spark
spec:
  scaleTargetRef:
    apiVersion: data.fluid.io/v1alpha1
    kind: AlluxioRuntime
    name: spark
  minReplicas: 1
  maxReplicas: 4
  metrics:
  - type: Object
    object:
      metric:
        name: capacity_used_rate
      describedObject:
        apiVersion: data.fluid.io/v1alpha1
        kind: Dataset
        name: spark
      target:
        type: Value
        value: "90"
  behavior:
    scaleUp:
      policies:
      - type: Pods
        value: 2
        periodSeconds: 600
    scaleDown:
      selectPolicy: Disabled
EOF
```
First, let's explain the sample configuration. There are two main parts: one is the rules of expansion and contraction, and the other is the sensitivity of expansion and contraction:

- **rule**: the condition that triggers the capacity expansion behavior is that the amount of cached data of the dataset object accounts for 90% of the total cache capacity; The capacity expansion object is' alluxioruntime '. The minimum number of replicas is 1 and the maximum number of replicas is 4; The objects of dataset and alluxioruntime need to be in the same namespace.

- **policy**: k8s versions above 1.18 can be used, and the stabilization time and one-time expansion and contraction step ratio can be set for expansion and contraction scenarios respectively. For example, in this example, a capacity expansion cycle is 10 minutes (periodseconds), and two replicas are added during capacity expansion. Of course, this can not exceed the limit of maxreplicas; After a capacity expansion, the cooling time (stabilization window seconds) is 20 minutes; The volume reduction strategy can be closed directly.

  

### 11. Check the HPA configuration. The data proportion of the current cache space is 0. It is far lower than the condition for triggering capacity expansion.

```bash

$ kubectl get hpa
NAME    REFERENCE              TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
spark   AlluxioRuntime/spark   0/90      1         4         1          33s
$ kubectl describe hpa
Name:                                                    spark
Namespace:                                               default
Labels:                                                  <none>
Annotations:                                             <none>
CreationTimestamp:                                       Wed, 07 Apr 2021 17:36:39 +0800
Reference:                                               AlluxioRuntime/spark
Metrics:                                                 ( current / target )
  "capacity_used_rate" on Dataset/spark (target value):  0 / 90
Min replicas:                                            1
Max replicas:                                            4
Behavior:
  Scale Up:
    Stabilization Window: 0 seconds
    Select Policy: Max
    Policies:
      - Type: Pods  Value: 2  Period: 600 seconds
  Scale Down:
    Select Policy: Disabled
    Policies:
      - Type: Percent  Value: 100  Period: 15 seconds
AlluxioRuntime pods:   1 current / 1 desired
Conditions:
  Type            Status  Reason               Message
  ----            ------  ------               -------
  AbleToScale     True    ScaleDownStabilized  recent recommendations were higher than current one, applying the highest recent recommendation
  ScalingActive   True    ValidMetricFound     the HPA was able to successfully calculate a replica count from Dataset metric capacity_used_rate
  ScalingLimited  False   DesiredWithinRange   the desired count is within the acceptable range
Events:           <none>
```

### 12. Create data preheating task

```bash
$ cat<<EOF > dataload.yaml
apiVersion: data.fluid.io/v1alpha1
kind: DataLoad
metadata:
  name: spark
spec:
  dataset:
    name: spark
    namespace: default
EOF
$ kubectl create -f dataload.yaml
$ kubectl get dataload
NAME    DATASET   PHASE       AGE   DURATION
spark   spark     Executing   15s   Unfinished
```



### 13. At this time, it can be found that the amount of cached data is close to the cache capacity (1gib) that fluid can provide, and the elastic scaling condition is triggered

```bash
$  kubectl  get dataset
NAME    UFS TOTAL SIZE   CACHED       CACHE CAPACITY   CACHED PERCENTAGE   PHASE   AGE
spark   2.71GiB          1020.92MiB   1.00GiB          36.8%               Bound   5m15s
```
From the monitoring of HPA, it can be seen that the expansion of alluxio runtime has started. It can be found that the step size of expansion is 2.
```bash

$ kubectl get hpa
NAME    REFERENCE              TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
spark   AlluxioRuntime/spark   100/90    1         4         2          4m20s
$ kubectl describe hpa
Name:                                                    spark
Namespace:                                               default
Labels:                                                  <none>
Annotations:                                             <none>
CreationTimestamp:                                       Wed, 07 Apr 2021 17:56:31 +0800
Reference:                                               AlluxioRuntime/spark
Metrics:                                                 ( current / target )
  "capacity_used_rate" on Dataset/spark (target value):  100 / 90
Min replicas:                                            1
Max replicas:                                            4
Behavior:
  Scale Up:
    Stabilization Window: 0 seconds
    Select Policy: Max
    Policies:
      - Type: Pods  Value: 2  Period: 600 seconds
  Scale Down:
    Select Policy: Disabled
    Policies:
      - Type: Percent  Value: 100  Period: 15 seconds
AlluxioRuntime pods:   2 current / 3 desired
Conditions:
  Type            Status  Reason              Message
  ----            ------  ------              -------
  AbleToScale     True    SucceededRescale    the HPA controller was able to update the target scale to 3
  ScalingActive   True    ValidMetricFound    the HPA was able to successfully calculate a replica count from Dataset metric capacity_used_rate
  ScalingLimited  False   DesiredWithinRange  the desired count is within the acceptable range
Events:
  Type     Reason                        Age                    From                       Message
  ----     ------                        ----                   ----                       -------
  Normal   SuccessfulRescale             21s                    horizontal-pod-autoscaler  New size: 2; reason: Dataset metric capacity_used_rate above target
  Normal   SuccessfulRescale             6s                     horizontal-pod-autoscaler  New size: 3; reason: Dataset metric capacity_used_rate above target
```
### 14. After waiting for a period of time, it is found that the cache space of the data set has increased from 1gib to 3gib, and the data cache is almost complete

```bash
$ kubectl  get dataset
NAME    UFS TOTAL SIZE   CACHED    CACHE CAPACITY   CACHED PERCENTAGE   PHASE   AGE
spark   2.71GiB          2.59GiB   3.00GiB          95.6%               Bound   12m
```
At the same time, by observing the status of HPA, it can be found that the number of replicas in the runtime corresponding to the dataset is 3, and the proportion of cache space used is capacity_ used_ When the rate is 85%, the cache expansion will not be triggered.
```bash
$ kubectl get hpa
NAME    REFERENCE              TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
spark   AlluxioRuntime/spark   85/90     1         4         3          11m
```
### 15. Clean up the environment

```bash
skubectl delete hpa spark
kubectl delete dataset spark
```
## Summary
Fluid provides the ability to trigger automatic elastic scaling according to the proportion of cache space occupied by the combination of prometheous, kubernetes HPA and custom metrics, so as to realize the on-demand use of cache capacity. This can help users use more flexibly and improve data access acceleration through distributed caching. In the future, we will provide the ability of regular expansion and contraction to provide greater certainty for expansion and contraction.
Fluid's code warehouse: https://github.com/fluid-cloudnative/fluid.git , welcome to pay attention, contribute code and star.

