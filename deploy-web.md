# 本地编译

1. 安装nodejs
2. 从github中下载源码
3. 运行以下命令

    ```bash
    cd fluid-web-src
    vuepress dev docs
    ```
# 上传至github

1. 将 docs/.vuepress/config.js 中的 base 值替换为目标仓库名称
2. 修改 deploy.sh 其中的git地址
3. 运行 bash deploy.sh 命令
4. 在对应仓库中查看

注： 需要上传到fluid的话需要push的权限和新增分支（gh-pages）的权限