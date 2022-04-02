module.exports = {
    head: [['link', { rel: 'icon', href: '/fluid-stacked-color.svg' }]],
    base: "/fluid/",
    locales: {
      '/': {
        lang: 'en-us',
        title: 'Fluid',
        description: 'Fluid, elastic data abstraction and acceleration for BigData/AI applications in cloud.',
      },
      '/zh/': {
        lang: 'zh-ch',
        title: 'Fluid',
        description: 'Fluid, 在云上为大数据以及AI应用的弹性数据提供抽象和加速服务。',
      },
    },
    themeConfig: {
      backgroundImg:'https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/bk1.jpg',
      featureLogos:['https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/abstr-icon.png','https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/acclearte-icon.png','https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/schedule-icon.png'],
      displayAllHeaders: false,
      logo: '/fluid-stacked-color.svg',
      hlogo:  '/fluid-horizontal-color.png',
      darkMode: false,
      repo: 'https://github.com/fluid-cloudnative/fluid',
      editLinks: false,
      search: true,
      searchMaxSuggestions: 10,
      locales: {
        '/': {
          selectText: 'Languages',
          label: 'English',
          nav: [
            {
              text: 'Docs',
              items: [
                  {text: 'Guide',link: '/guide/'},
                  {text: 'Dev',link: '/dev/'},
                  {text: 'Samples',link: '/samples/'}
                ],
            },
            {
              text: 'Community',
              items:[
                {text: 'Community', link: '/community/community.md'},
                {text: 'Adopters', link: '/community/ADOPTERS.md'}
              ],
            },
            {
              text: 'Blog',
              items: [
                {text:'Technology', link:'/blog/technology/'},
                {text:'Releases', link:'/blog/releases/'},
                {text:'Case Study',link: '/blog/casestudy/'},
              ]
            },
          ],
          sidebar: {
            '/guide/': ['','get_started','install','troubleshooting','faq',],
            '/samples/': ['','accelerate_pvc','machinelearning','data_warmup','accelerate_hdfs','accelerate_s3_minio','data_co_locality'
          ,'multi_dataset_same_node_accessing','nonroot_access','tieredstore_config','use_encryptoptions'
          ],
            '/dev/':['','api_doc','dev_with_kind','/dev/profiling','multiple-client-support'],
            '/blog/casestudy/':[''],
            '/blog/releases/':['','fluid04','fluid03'],
            '/blog/technology/':['','fluid_cncf','fluid_logistics','scaling']
          },
        },
        '/zh/': {
          selectText: '语言',
          label: '简体中文',
          nav: [
            {
              text: '文档',
              items: [
                  {text: '指南',link: '/zh/guide/'},
                  {text: '开发',link: '/zh/dev/'},
                  {text: '示例',link: '/zh/samples/'}
                ],
            },
            { 
              text: '社区',
              items:[
                {text: '社区', link: '/zh/community/community.md'},
                {text: '合作伙伴', link: '/zh/community/ADOPTERS.md'}
              ],
            },
            {
              text: '博客',
              items: [
                {text:'技术内幕', link:'/zh/blog/technology/'},
                {text:'版本发布', link:'/zh/blog/releases/'},
                {text:'案例学习',link: '/zh/blog/casestudy/'},
              ]
            },
          ],
          sidebar: {
            '/zh/guide/': ['', 'get_started','install','troubleshooting','faq'],
            '/zh/samples/': ['','accelerate_pvc','machinelearning','data_warmup','accelerate_hdfs',
                  'api_proxy','backup_and_restore_metadata',
                  'data_co_locality','data_toleration','dataset_scaling',
                  'fuse_affinity','hdfs_configuration','hostpath','master_high_avaliability',
                  'multi_dataset_same_node_accessing','nonroot_access','tieredstore_config','use_encryptoptions'],
            '/zh/dev/':['','api_doc','runtime_dev_guide','profiling','multiple-client-support','use_go_create_resource'],
            '/zh/blog/casestudy/':[''],
            '/zh/blog/releases/':['','fluid04','fluid03'],
            '/zh/blog/technology/':['','fluid_cncf','fluid_logistics','scaling']
          },
        },
      },
    },
  }