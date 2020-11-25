import React from 'react';
import { Button, Col, Form, Row } from 'antd';
/**
 * 生成搜索按钮代码
 * @param {*} sourceData
 */
const generateAreaOperate = (sourceData) => {
    const btn = [];
    for (let i = 0; i < sourceData.tasks.length; i++) {
        const task = sourceData.tasks[i];
        btn.push(`<Button type="${task.attrs.type.value}">${task.attrs.name.value}</Button>`);
    }
    if (btn.length > 0) {
        return "<div className='br-operate-container'>" + btn.join('/n') + '</div>';
    } else {
        return '';
    }
};

/**
 * 生成搜素区域代码
 * @param {*} sourceData
 */
const generateAreaSearch = (sourceData) => {
    const items = [];
    for (let i = 0; i < sourceData.tasks.length; i++) {
        const task = sourceData.tasks[i];
        const placeholder = task.attrs.placeholder && task.attrs.placeholder.value;
        if (placeholder) {
            task.componentStr.replaceAll('/>', "placeholder='请输入' />");
        }
        items.push(
            `<Col span={8}>
                <Form.Item label="${task.attrs.label && task.attrs.label.value}" name="${task.attrs.name && task.attrs.name.value}" rules={[
                        {
                            required: ${task.attrs.required && task.attrs.required.value},
                            message: '${task.attrs.label && task.attrs.label.value}不能为空！'
                        }
                    ]}
                >
                ${task.componentStr}
                </Form.Item>
            </Col>`
        );
    }
    if (items.length > 0) {
        const offset = 2 - (items.length % 3);
        console.log('offset=', offset);
        items.push(
            `<Col span={8} offset={${offset}}>
                <div className='br-btn-inline'>
                    <Button onClick={() => {}}> 重置 </Button>
                    <Button type='primary' onClick={() => { }}>搜索</Button>
                </div>
            </Col>`
        );
        return `<Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            >
                <Row gutter={{ xs: 8, sm: 16, md: 24 }}>${items.join('\n')}</Row>
            </Form>`;
    } else {
        return '';
    }
};

const generateAreaTable = (sourceData) => {
    if (sourceData.tasks && sourceData.tasks[0] && sourceData.tasks[0].component) {
        return sourceData.tasks[0].componentStr;
    }
    return '';
};

const generateCode = (sourceData) => {
    console.log('sourceData=', sourceData);
    const extraCodeStrBegin = `
    import React, { Component } from 'react';
    import { Button, Form, Row, Col, Input } from 'antd';
    export default class TabDemo extends Component {
        render() {
            return (
                <div className='br-page'>
                </div>
                );
    `;
    const extraCodeStrEnd = ` </div>)\n}\n}\n`;
    let codeStr = ` <div className='br-page'>
                        ${generateAreaOperate(sourceData['area-operate'])}
                        ${generateAreaSearch(sourceData['area-search'])}
                        ${generateAreaTable(sourceData['area-table'])}
                    </div>`;

    console.log('生成的代码=\n', `${extraCodeStrBegin}\n${codeStr}\n${extraCodeStrEnd}`);
    return `${extraCodeStrBegin}\n${codeStr}\n${extraCodeStrEnd}`;
};

const GenerateService = {
    generateCode
};

export default GenerateService;
