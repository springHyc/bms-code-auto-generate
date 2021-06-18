const fs = require('fs');
const archiver = require('archiver');

function WriteFile(file, content, res, mark = 'table') {
    const { indexCodeStr, columnsCodeStr } = content;
    const err = fs.rmdirSync(`${__dirname}/tmp/${mark}`, { recursive: true });
    if (err) {
        throw err;
    }
    console.log('生成文件前，先清理文件！');
    fs.mkdirSync(file, { recursive: true });
    fs.writeFile(`${file}/index.js`, indexCodeStr, (err) => {
        if (err) {
            throw err;
        }
    });
    if (columnsCodeStr) {
        fs.writeFile(`${file}/columns.js`, columnsCodeStr, (err) => {
            if (err) {
                throw err;
            }
        });
    }
    console.log(`成功创建文件，其目录为：${file}`);
    return res.send({ code: 0, message: `成功创建文件，其目录为：${file}` });
}
function downFile(res, moduleName, mark) {
    res.download(`${__dirname}/${moduleName}.zip`, `${moduleName}.zip`, (err) => {
        if (err) {
            res.status(400).end();
        } else {
            res.end();
            fs.unlink(`${__dirname}/${moduleName}.zip`, function (err) {
                if (err) {
                    throw err;
                }
                console.log('文件下载成功后删除文件成功！', '\n===========\n');
            });
        }
    });
}

/**
 * 压缩后的文件，直接暂存在/service/目录下，下载完成后直接删除
 *
 * @param {*} res
 * @param {*} moduleName
 * @param {string} [mark='table']
 */
function zip(res, moduleName, mark = 'table') {
    const output = fs.createWriteStream(__dirname + `/${moduleName}.zip`);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    archive.directory(__dirname + `/tmp/${mark}/${moduleName}/`, false);
    archive.pipe(output);
    archive.finalize();
    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('打zip包完成');
        downFile(res, moduleName, mark);
    });
}

module.exports = {
    WriteFile,
    zip
};
