# BmsCodeAutoGenerate

[后台管理系统自定义拖拽生成代码工具](http://47.105.170.226)。目前写好了一个拖拽生成通用 Table 页面、拖拽生成 form 表单页面的功能。可生成代码，复制，亦可下载 zip 包可拷贝使用。欢迎使用并提出宝贵的意见。

## TODO

- [ ] 存储草稿功能
- [ ] 多人系统，考虑并发
- [ ] 写一个一键部署的 shell 文件
- [ ] 添加正则校验
- [ ] 添加点击事件
- [ ] 添加类组件和函数组件的两种写法：form+table 中

## 功能点

### 1. 拖拽生成 Table 页面

- 拖拽组件，从菜单栏到中间区域，或者同区域内更换位置，不同区域可以更换，只是目前，没有一个组件是会同时可以出现在 2 个区域的，所以此功能暂时无法看到；
- 单击编辑属性
- 右击删除
- 生成代码
  - 可直接复制
  - 可生成文件并下载 zip 包

### 2. 拖拽自动生成 Form 表单

拖拽生成 form 表单，从左侧菜单栏中，将 form 元素拖到中间区域，可根据右上角的「N 列布局」输入你想要的 N 列布局，中间区域的各个 form 表单元素，可自由拖拽更换位置。可以点击[这里](http://47.105.170.226/)来使用。此功能第一个版本可以看到的有:

- 可以生成是单列，双列或者 N([1,10]) 列
- 可以拖拽生成组件
- 添加普通校验:必填
- 单击编辑属性
- 右击删除
- 生成代码
  - 可直接复制
  - 可生成文件并下载 zip 包
- [ ] 添加正则校验
- [x] 解决拖拽过程中定位不准确的 bug

在使用过程中，有任何想法与问题，随时来找我啊，这样才能更加完善功能，更加 happy 的 code。

## 一键部署（未成功）

```shell
# 输入密码这一步是怎么搞定的？
ssh root@47.105.170.226
cd /srv/bms-code-auto-generate
git pull origin master
# 只需要一遍即可
pm2 start index.js --watch

npm run build
scp -r build root@ssh root@47.105.170.226:/srv
rm -rf front/
mv build front

```

## 如何将本地的公钥放到服务器上，避免登录服务器输入密码

```shell
# 登录服务器
ssh root@47.105.170.226
# 找到authorized_keys文件，然后将本机的id_rsa.pub中的公钥拷贝进去
## 本机操作，找到id_rsa.pub中的公钥
cd ~/.ssh & cat id_rsa.pub

# 服务器操作
## 打开authorized_keys文件
cd .ssh & vim authorized_keys

# 将id_rsa.pub内容拷贝进去
## 退出服务器
logout
```

## 远程部署命令

```shell
# 登录远程服务器
ssh root@47.105.170.226

# 更新代码
cd /srv/bms-code-auto-generate
git pull origin master

# 远程启动后端
nohup node index.js &
# 关闭后端服务
ps aux | grep node
kill -9 pid

# 启动后端服务，pm2版本
## 全局安装pm2
npm install -g pm2
## 改用pm2来启动程序--watch表示，监控程序运行状态，一旦：服务异常：自动重启;服务发生变化：自动重启
pm2 start index.js --watch
# 拷贝前端
# 在本地项目执行命令
# 正确来说，应该在服务器上执行这个命令
npm run build

# 拷贝
# 服务器上的路径，/srv/front，直接将文件夹重命名为front
# 注意：一定要在该项目目录下进行
scp -r build root@ssh root@47.105.170.226:/srv

# 重命名
# 删除旧的文件
rm -rf front/
# 重命名build为front
mv build front
```

## v2.0(tag)

- 能复制代码，只是简单代码，不能运行
- 能删除元素

## 拖拽库的参考

- [react-beautiful-dnd 中文文档](https://github.com/chinanf-boy/react-beautiful-dnd-zh)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- [react-beautiful-dnd 中 Support dragging a copy (leave original in place)
  ](https://codesandbox.io/s/40p81qy7v0)
- [Packery](https://packery.metafizzy.co/) (with jq)
- [React-Grid-Layout](https://github.com/STRML/react-grid-layout)
- [React Use Gesture](https://use-gesture.netlify.app/docs/examples/)
- [axios-jsonp-pro](https://www.npmjs.com/package/axios-jsonp-pro)
