const express = require('express');

const FileService = require('./fileService');

const app = express();
const port = 3003;
let moduleName = 'home';

//加入这个配置,就可以在请求对象req中得到req.body,并通过req.body来获取post请求,请求体内容
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'content-type');
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
    if (req.method.toLowerCase() === 'options') res.send(200);
    else next();
});

/*
 * 测试接口
 */
app.get('/api/', (req, res) => {
    res.send("<span style='font-size: 18px;'}>欢迎使用拖拽自动生成代码工具的后台生成文件目录系统，V2</span>");
});

/*
 * table生成目录
 */
app.post('/api/table/generate-files', (req, res) => {
    // 创建文件目录
    var indexCodeStr = req.body.code;
    var _moduleName = req.query.moduleName || moduleName; // *要生成的模块的name
    var columnsCodeStr = req.body.columnsCodeStr;
    const codeStr = {
        indexCodeStr,
        columnsCodeStr
    };
    return FileService.WriteFile(`${__dirname}/tmp/table/${_moduleName}`, codeStr, res);
});

/*
 * table下载打包好的文件
 */
app.get('/api/table/down', (req, res) => {
    const name = req.query.moduleName || moduleName;
    return FileService.zip(res, name);
});

/*
 * form生成目录
 */
app.post('/api/form/generate-files', (req, res) => {
    // 创建文件目录
    var indexCodeStr = req.body.code;
    var _moduleName = req.query.moduleName || moduleName; // *要生成的模块的name
    return FileService.WriteFile(`${__dirname}/tmp/form/${_moduleName}`, { indexCodeStr }, res, 'form');
});

app.get('/api/form/down', (req, res) => {
    const name = req.query.moduleName || moduleName;
    return FileService.zip(res, name, 'form');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
