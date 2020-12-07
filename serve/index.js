const express = require('express');
var bodyParser = require('body-parser');

const fs = require('fs');
const app = express();
const port = 3001;

//加入这个配置,就可以在请求对象req中得到req.body,并通过req.body来获取post请求,请求体内容
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// app.use(express.static(__dirname + '/code'));

app.all('*', function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*');
    //允许的header类型
    res.header('Access-Control-Allow-Headers', 'content-type');
    //跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
    if (req.method.toLowerCase() === 'options') res.send(200);
    //让options尝试请求快速结束
    else next();
});

app.get('/', (req, res) => {
    res.send("<span style='font-size: 18px;'}>欢迎使用拖拽自动生成代码工具的后台生成文件目录系统</span>");
});

function WriteFile(file, content, res) {
    fs.open(file, 'r', (err, fd) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.mkdir(file, { recursive: true }, (err) => {
                    if (err) throw err;
                });
                fs.writeFile(`${file}/index.js`, content, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        } else {
            fs.writeFile(`${file}/index.js`, content, (err) => {
                if (err) {
                    throw err;
                }
            });
        }
    });

    return res.send({ code: 0, message: `成功创建文件，其目录为：${file}/` });
}

app.post('/files/generate', (req, res) => {
    // 创建文件目录
    var codeStr = req.body.code;
    var fileName = req.query.fileName || 'home';
    return WriteFile(`${__dirname}/tmp/${fileName}`, codeStr, res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
