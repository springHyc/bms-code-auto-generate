function addImportCodeStr(source, addImportStr) {
    const addImportStrKeyWords = addImportStr.match(/{\s*\w*(,\s*\w*)*\s*}/)[0]; // 要引入的组件
    const addImportStrImportSourceKey = addImportStr.match(/'\s*\w*\s*'/)[0]; // 从哪个包引入
    let result = source;
    if (source.indexOf(addImportStrImportSourceKey) !== -1) {
        const keyWords = addImportStrKeyWords.replaceAll(/[{}]/g, '').split(',');
        if (keyWords && keyWords.length > 0) {
            keyWords.forEach((keyWord) => {
                if (result.indexOf(keyWord) === -1) {
                    // 添加
                    let sourceArr = result.split(';');
                    sourceArr = sourceArr.map((item) => {
                        if (item.indexOf(addImportStrImportSourceKey) !== -1) {
                            const _strs = item.split('{');
                            _strs[1] = keyWord.replaceAll(/[{}]/g, '') + ',' + _strs[1];
                            item = _strs.join('{');
                        }
                        return item;
                    });
                    result = sourceArr.join(';');
                }
            });
        }
    } else {
        result = `${result}${addImportStr}\n`;
    }
    return result;
}
// 字符串处理
const StringService = {
    addImportCodeStr
};

export default StringService;
