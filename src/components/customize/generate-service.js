import StringService from './string-service';
import _ from 'lodash';

export default class GenerateService {
    constructor(areas) {
        this.importCodeStr = "import React, { Component } from 'react';\n";
        this.indexCodeStr = '';
        this.columnsCodeStr = '';
        this.renderConstCodeStr = '';
        this.getColumnsFnCodeStr = '';
        this.assistCodeStr = ''; // 放在class中的其他代码
        this.generateIndexCode(areas);
    }

    /**
     * 生成搜索按钮代码
     * @param {*} sourceData
     */
    generateAreaOperate = (sourceData) => {
        const btn = [];
        for (let i = 0; i < sourceData.tasks.length; i++) {
            const task = sourceData.tasks[i];
            btn.push(`
                    <Button type='${task.attrs.type.value}'>
                        ${task.attrs.name.value}
                    </Button>`);
            this.importCodeStr = StringService.addImportCodeStr(this.importCodeStr, sourceData.tasks[0].importStr || '');
        }
        if (btn.length > 0) {
            return `                <div className='br-operate-container'>${btn.join('\n')}
                </div>`;
        } else {
            return '';
        }
    };
    /**
     * 生成搜素区域代码
     * @param {*} sourceData
     */
    generateAreaSearch = (sourceData) => {
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
            this.importCodeStr = StringService.addImportCodeStr(this.importCodeStr, task.importStr || '');
        }
        if (items.length > 0) {
            this.importCodeStr = StringService.addImportCodeStr(this.importCodeStr, "import {Form,Row,Col} from 'antd';");
            const offset = (2 - (items.length % 3)) * 8;
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

    /**
     * 解析并生成table的代码
     * @param {*} sourceData
     */
    generateAreaTable = (sourceData) => {
        let tableComponentStr = '';
        if (sourceData.tasks && sourceData.tasks[0] && sourceData.tasks[0].component) {
            this.importCodeStr = StringService.addImportCodeStr(this.importCodeStr, sourceData.tasks[0].importStr || '');
            tableComponentStr = _.cloneDeep(sourceData.tasks[0].componentStr);
            if (Object.prototype.hasOwnProperty.call(sourceData.tasks[0], 'attrs') && Object.keys(sourceData.tasks[0].attrs).length > 0) {
                const isEdit = this.generateAssistTable(sourceData.tasks[0].attrs);
                if (isEdit) {
                    tableComponentStr = tableComponentStr.replace('columns={columns}', 'columns={this.getColumns()}');
                }
            }
            // 还要辅助处理 const {data} = this.props.Name;
            this.renderConstCodeStr = `
        const data = this.props.Name;`;
            this.assistCodeStr = `
            pageInfo = { pageSize: 10, pageNum: 1 };`;
            return tableComponentStr;
        }
        return '';
    };

    /**
     * 生成主要文件'index.js'的代码
     * @param {} sourceData
     */
    generateIndexCode = (sourceData) => {
        const begin1 = `
export default class TabDemo extends Component {`;

        const render1 = `    render() {`;

        const render3 = `
        return (
            <div className='br-page'>`;
        const end = `
            </div>
        );
    }
}`;
        const contentCodeStr = `${this.generateAreaOperate(sourceData['area-operate'])}${this.generateAreaSearch(
            sourceData['area-search']
        )}${this.generateAreaTable(sourceData['area-table'])}`;
        this.indexCodeStr = `${this.importCodeStr}${begin1}${this.assistCodeStr}${this.getColumnsFnCodeStr}${render1}${this.renderConstCodeStr}${render3}\n${contentCodeStr}${end}`;
    };

    generateAssistTable = (tableConfigData) => {
        let isEdit = false;
        const { columns, operate } = tableConfigData;
        if (columns && columns.length > 0) {
            // * 单独生成columns.js文件
            this.generateColumnsCodeStr(columns);
        }
        if (operate && operate.length > 0) {
            // * 当存在操作列时
            this.generateGetColumnsFnCodeStr(operate);
            const importStatement = "import {Button} from 'antd';";
            this.importCodeStr = StringService.addImportCodeStr(this.importCodeStr, importStatement);
            isEdit = true;
        }
        return isEdit;
    };

    generateColumnsCodeStr = (columnsConfigData) => {
        const begin = `export default [`;
        const end = `\n];`;
        const items = [];
        columnsConfigData.forEach((item) => {
            items.push(`
    {
        title: '${item.title}',
        dataIndex: '${item.dataIndex}'
    }`);
        });
        this.columnsCodeStr = `${begin}${items.join(',')}${end}`;
        var importStatement = "import columns from './columns';";
        this.importCodeStr = StringService.addImportCodeStr(this.importCodeStr, importStatement, true);
    };

    generateGetColumnsFnCodeStr = (operate) => {
        const btns = [];
        operate.forEach((btn) => {
            btns.push(`
                        <Button
                            type='link'
                            onClick={() => {}}
                        >
                            ${btn.name}
                        </Button>`);
        });
        this.getColumnsFnCodeStr = `
    getColumns = () =>
        columns.concat([
            {
                title: '操作',
                dataIndex: 'operate',
                render: (value, record) => (
                    <div className='br-operate-wrapper'>${btns.join('')}
                    </div>
                )
            }
        ]);
    `;
    };
}
