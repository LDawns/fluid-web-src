set -e

npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 更换为自己的git地址
git remote add origin https://github.com/LDawns/test_fluid-web.git

# 如果发布到 https://<USERNAME>.github.io/<REPO> ..必须要亲手这么搞
git push -f origin master:gh-pages

cd -