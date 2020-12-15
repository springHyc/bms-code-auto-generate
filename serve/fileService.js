const fs = require('fs');
const archiver = require('archiver');

function WriteFile(file, content, res) {
    const { indexCodeStr, columnsCodeStr } = content;
    fs.rmdir(file, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
        console.log('生成文件前，先清理文件！');
        fs.open(file, 'r', (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.mkdir(file, { recursive: true }, (err) => {
                        if (err) throw err;
                    });
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
                }
            } else {
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
            }
        });
    });
    return res.send({ code: 0, message: `成功创建文件，其目录为：${file}/` });
}
function downFile(res, moduleName) {
    res.download(`${__dirname}/${moduleName}.zip`, `${moduleName}.zip`, (err) => {
        if (err) {
            res.status(400).end();
        } else {
            // fs.unlink(`${__dirname}/${moduleName}.zip`, function (err) {
            //     if (err) {
            //         throw err;
            //     }
            //     console.log('文件下载成功后删除文件成功！', '\n===========\n');
            // });
            console.log('文件下载成功后成功！', '\n===========\n');
            res.end();
        }
    });
}

function zip(res, moduleName) {
    const output = fs.createWriteStream(__dirname + `/${moduleName}.zip`);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    archive.directory(__dirname + `/tmp/${moduleName}/`, false);
    archive.pipe(output);
    archive.finalize();
    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('打zip包完成');
        downFile(res, moduleName);
    });
}

module.exports = {
    WriteFile,
    zip
};
