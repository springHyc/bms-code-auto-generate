import React from 'react';
import { Button } from 'antd';
import _ from 'lodash';
const TOTAL = 15;

/**
 * 随机生成一个汉字
 *
 * @returns
 */
function getRandomChineseWord() {
    var _rsl = '';
    var _randomUniCode = Math.floor(Math.random() * (40870 - 19968) + 19968).toString(16); // 汉字
    // 2F00-2FDF：康熙字典部首
    // var _randomUniCode = Math.floor(Math.random() * (12255 - 12032) + 12032).toString(16);
    // eslint-disable-next-line no-eval
    eval(`_rsl="\\u${_randomUniCode}"`);
    return _rsl;
}

function getRandomWord() {
    const num = Math.floor(Math.random() * 10 + 1);
    let str = '';
    for (let i = 0; i < num; i++) {
        str += getRandomChineseWord();
    }
    return str;
}

const randomData = (columns) => {
    const keys = [],
        mockData = [];
    columns.forEach((element) => {
        keys.push(element.dataIndex);
    });

    for (let i = 0; i < TOTAL; i++) {
        const item = {};
        keys.forEach((key) => {
            item[key] = getRandomWord();
        });
        item.id = item.id || i;

        mockData.push(item);
    }
    return mockData;
};

/**
 * Table 获取columns
 *
 * @param {*} attrs
 * @returns
 */
function getColumns(attrs) {
    const columns = _.cloneDeep(attrs.columns);

    if (attrs.operate.length > 0) {
        let operateRender = [];
        attrs.operate.forEach((item, idx) => {
            operateRender.push(
                <Button key={idx} type='link' onClick={() => {}}>
                    {item.name}
                </Button>
            );
        });
        const operate = {
            title: '操作',
            dataIndex: 'operate',
            render: (value, record) => <div className='br-operate-wrapper'>{operateRender}</div>
        };
        return columns.concat(operate);
    }
    return columns;
}
const Utils = { randomData, getColumns };

export default Utils;
