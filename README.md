# BmsCodeAutoGenerate

## 远程部署命令

```shell
# 登录远程服务器
ssh root@47.105.170.226

# 远程启动后端
nohup node index.js &
# 关闭后端服务
ps aux | grep node
kill -9 pid

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
