import StringService from './string-service';

let importCodeStr = "import React, { Component } from 'react';\n";
/**
 * 生成搜索按钮代码
 * @param {*} sourceData
 */
const generateAreaOperate = (sourceData) => {
    const btn = [];
    for (let i = 0; i < sourceData.tasks.length; i++) {
        const task = sourceData.tasks[i];
        btn.push(`
                    <Button type='${task.attrs.type.value}'>
                        ${task.attrs.name.value}
                    </Button>`);
        importCodeStr = StringService.addImportCodeStr(importCodeStr, sourceData.tasks[0].importStr || '');
    }
    if (btn.length > 0) {
        return `                <div className='br-operate-container'>
                    ${btn.join('/n')}
                </div>`;
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
            `\n
                            <Col span={8}>
                                <Form.Item 
                                    label='${task.attrs.label && task.attrs.label.value}'
                                    name='${task.attrs.name && task.attrs.name.value}'
                                    rules={[
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
        importCodeStr = StringService.addImportCodeStr(importCodeStr, task.importStr || '');
    }
    if (items.length > 0) {
        importCodeStr = StringService.addImportCodeStr(importCodeStr, "import {Form,Row,Col} from 'antd';");
        const offset = (2 - (items.length % 3)) * 8;
        console.log('offset=', offset);
        items.push(
            `
                            <Col span={8} offset={${offset}}>
                                <div className='br-btn-inline'>
                                    <Button onClick={() => {}}> 重置 </Button>
                                    <Button type='primary' onClick={() => { }}>搜索</Button>
                                </div>
                            </Col>`
        );
        return `
                <div className='br-select-container'>
                    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>${items.join('\n')}
                        </Row>
                    </Form>
                </div>`;
    } else {
        return '';
    }
};

const generateAreaTable = (sourceData) => {
    if (sourceData.tasks && sourceData.tasks[0] && sourceData.tasks[0].component) {
        importCodeStr = StringService.addImportCodeStr(importCodeStr, sourceData.tasks[0].importStr || '');
        return sourceData.tasks[0].componentStr;
    }
    return '';
};

const generateCode = (sourceData) => {
    console.log('sourceData=', sourceData);
    const extraCodeStrBegin = `
export default class TabDemo extends Component {
    render() {
        return (
            <div className='br-page'>`;
    const extraCodeStrEnd = `
            </div>
        );
    }
}`;
    let contentCodeStr = `${generateAreaOperate(sourceData['area-operate'])}
                ${generateAreaSearch(sourceData['area-search'])}
                ${generateAreaTable(sourceData['area-table'])}`;

    const codeStr = `${importCodeStr}${extraCodeStrBegin}\n${contentCodeStr}${extraCodeStrEnd}`;
    console.log('生成的代码=\n', codeStr);
    return codeStr;
};

const GenerateService = {
    generateCode
};

export default GenerateService;
