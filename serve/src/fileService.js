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
function downFile(res) {
    res.download(`${__dirname}/example.zip`, 'code.zip', (err) => {
        if (err) {
            res.status(400).end();
        } else {
            fs.unlink(`${__dirname}/example.zip`, function (err) {
                if (err) {
                    throw err;
                }
                console.log('文件下载成功后删除文件成功！', '\n===========\n');
            });
            res.end();
        }
    });
}

function zip(res) {
    const output = fs.createWriteStream(__dirname + '/example.zip');
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    archive.directory(__dirname + '/tmp/home/', false);
    archive.pipe(output);
    archive.finalize();
    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('打zip包完成');
        downFile(res);
    });
}

module.exports = {
    WriteFile,
    zip
};
