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

1. 将 docs/.vuepress/config.js 中的 base 值替换为目标仓库名称（可以先用自己的仓库试试,仓库必须是public的奥。）
2. 修改 deploy.sh 其中的git地址
3. 运行 bash deploy.sh 命令
4. 在仓库的settings中点击pages选项卡，查看网页是否正常(https://usrname.github.io/repo-name/)


注1： 需要上传到fluid的话需要push的权限和新增分支（gh-pages）的权限
注2：应该也可以PR, 但base要设置为/base/, PR的目标分支也要是gh-pages

# 新增文章

1. 首先从 https://github.com/LDawns/fluid-web-src.git 中下载源码(包括node_moudles)
2. 确认文章新增的目标类型 下面以 文档-示例（Docs-Samples）（在UI中就是导航栏中先点击文档然后下拉菜单中的示例） 类文章为例
3. 向 docs/samples 中加入英文的markdown文件 (其他类型的路径可以在docs/.vuepress/config.js中对应查到)
4. 向 zh/docs/samples 中加入中文的markdown文件
5. 修改 docs/.vuepress/config.js 中的第一处 sidebar 中的 '/samples/' 列表值，向其中新增一项字符串，内容为刚刚加入的英文文件名
6. 修改 docs/.vuepress/config.js 中的第二处 sidebar 中的 '/samples/' 列表值，向其中新增一项字符串，内容为刚刚加入的中文文件名
7. 运行以下命令

    ```bash
    cd fluid-web-src
    vuepress dev docs
    ```
8. 可以从连接中点击看看是否更新成功，应该能在Docs-Samples选项卡中看到英文文档，在文档-示例选项卡中看到中文文档，若成功则参考上面的 `上传至Fluid`