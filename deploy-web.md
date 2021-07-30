# 本地编译测试

注：这一步主要是为了测试能否编译，第一次成功以后上传到fluid可以直接看
1. 安装nodejs
2. 从 https://github.com/LDawns/fluid-web-src.git 中下载源码(包括node_moudles)
3. 运行以下命令

    ```bash
    cd fluid-web-src
    vuepress dev docs
    ```

# 上传至Fluid

1. 将 docs/.vuepress/config.js 中的 base 值替换为目标仓库名称（可以先用自己的仓库试试,仓库必须是public的奥，）
2. 修改 deploy.sh 其中的git地址
3. 运行 bash deploy.sh 命令
4. 在仓库的settings中点击pages选项卡，查看网页是否正常(https://usrname.github.io/repo-name/)


注1： 需要上传到fluid的话需要push的权限和新增分支（gh-pages）的权限
注2：应该也可以PR, 但base要设置为/base/, PR的目标分支也要是gh-pages