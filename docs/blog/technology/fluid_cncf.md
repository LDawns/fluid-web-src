---
sidebarDepth: 0
---
# Fluid has become a sandbox project of CNCF, opening a new chapter of cloud native embracing data intensive applications

On April 27, 2021, reviewed and approved by the Technical Supervision Committee of cloud native Foundation (CNCF TOC), fluid, a distributed data set compilation and acceleration engine jointly sponsored by Nanjing University, Alibaba cloud and aluxio open source community, has officially become the official sandbox project of CNCF, providing support for the construction of AI, big data, cloud computing, cloud computing, etc High performance computing and other data intensive applications need "cloud native data platform" to lay the foundation.

The project was open source in September 2020, and developed rapidly in a short period of more than half a year, attracting the attention and contribution of many experts and engineers in the field. Engineers from Tencent cloud, China Telecom, cloud Zhisheng, boss direct employment, microblog, fourth paradigm and other enterprises have also contributed a lot of development work.

Fluid project address:*https://github.com/fluid-cloudnative/fluid*

Fluid is committed to combining the original research of academia and the landing practice of industry, accelerating the embrace of cloud native for data intensive applications, and building a unified interface for data consumption and management under kubernetes with the open source community.

## Project introduction

In the cloud native environment, while improving the system flexibility and flexibility, the computing storage separation architecture brings challenges to the computing performance and management efficiency of data intensive applications such as big data / AI. The existing cloud native orchestration framework running such applications is faced with high data access latency, difficult joint analysis of multiple data sources, complex data use process and other pain points. Fluid is born to solve these problems.

![fluid_archi](http://kubeflow.oss-cn-beijing.aliyuncs.com/Static/architecture.png)

## Core functions

The basic architecture mode of computing and storage separation in cloud native environment is more and more difficult to meet the requirements of big data / AI and other data intensive framework applications in computing efficiency and data abstract management. In order to solve the problems of high data access delay, difficult joint analysis of multiple data sources, complex application and data docking when the existing cloud native choreography framework runs such applications, fluid puts forward new ideas in collaborative choreography, scheduling optimization, data caching and other aspects, and realizes the following core functions:

-**support easy-to-use data set abstraction: **single point access of multiple independent storage systems can be realized through user-defined resources to achieve efficient data access, and support observability and elastic scalability;

-**simplify the way to read Kubernetes application data:** translate the abstract data set into the Kubernetes standard concept persistent volume claim, which can be directly used by the application, and connect the application seamlessly by mounting;

-**provide open extensible data cache runtime interface:** define the life cycle and deployment topology of distributed data cache engine, and define abstract interface. Currently, it supports cache runtime such as Alluxio and Jindofs;

-**intelligent data set scheduling based on container scheduling management:** intelligent data set migration is realized through the cooperation of data set cache engine and Kubernetes container scheduling and capacity expansion and reduction capability;

-**application scheduling for data localization on cloud:** Kubernetes scheduler obtains data cache information of nodes by interacting with cache engine, and schedules applications using the data to nodes containing data cache in a transparent way, so as to give full play to cache locality;

## Summary

Fluid open source project community is the accumulation of achievements from academia, industry and open source community. At present, five core maintainers of the community are from PASALab, Alibaba and alluxio of Nanjing University, and Dr. Gu Rong from PASALab of Nanjing University serves as the community operation chairman.

As a data intensive application operation support platform that is fully compatible with the complete ecology of native kubernetes, fluid will develop towards a more flexible, intelligent and scalable architecture, and continuously improve the friendly experience of open source developers. Fluid will also drive the iterative evolution of enterprise business and accelerate innovation by combining industry scenarios with big data / AI processing systems in subdivided fields. In the future, fluid will continue to work side by side with the community and with the ecology to promote the ecological construction and popularization of cloud native technology in the field of big data / AI system, and expand the boundaries of cloud native with global developers.