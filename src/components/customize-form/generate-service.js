import StringService from '../customize/string-service';
import _ from 'lodash';

export default class GenerateService {
    constructor(areas, numberOfColumns) {
        this.importCodeStr = "import React, { Component } from 'react';\n";
        this.indexCodeStr = '';
        this.columnsCodeStr = '';
        this.renderConstCodeStr = '';
        this.getColumnsFnCodeStr = '';
        this.assistCodeStr = ''; // 放在class中的其他代码
        this.generateIndexCode(areas, numberOfColumns);
    }

    /**
     * 生成Form表单代码
     * @param {*} sourceData
     */
    generateAreaForm = (sourceData, numberOfColumns) => {
        const valueOfSpan = 24 / numberOfColumns;
        const items = [];
        const btnTasks = sourceData.tasks.filter((task) => task.key === 'button');
        const noBtnTasks = sourceData.tasks.filter((task) => task.key !== 'button');

        for (let i = 0; i < noBtnTasks.length; i++) {
            const task = sourceData.tasks[i];
            const placeholder = task.attrs.placeholder && task.attrs.placeholder.value;
            const children = task.attrs?.children?.value;
            let componentStr = _.cloneDeep(task.componentStr);
            if (placeholder) {
                componentStr = componentStr.replace('>', ` placeholder='${placeholder}'>`);
            }
            if (task.key === 'text-show' && children) {
                componentStr = componentStr.replace(/>\w*<\//, `>${children}</`);
            } else if (task.key === 'select') {
                // * 是select的话，单独处理componentStr

                const options = [];
                task.attrs.options.value.forEach((item) => {
                    options.push(`<Select.Option value='${item.key}'>${item.value}</Select.Option>`);
                });
                componentStr = componentStr.replace(
                    '>',
                    `>
                                        ${options.join('\n')}
                                    `
                );
            } else if (task.key === 'checkbox' && children) {
                // 单独多选的处理
                const options = [];
                task.attrs.children.value.forEach((item) => {
                    options.push(`<Checkbox value='${item.key}'>${item.props.value}</Checkbox>`);
                });

                componentStr = componentStr.replace(
                    '>',
                    `>
                                ${options.join('\n                                  ')}
                                `
                );
            }
            const itemAttrs = {
                label: `'${task.attrs?.label?.value}'`,
                name: `'${task.attrs?.name?.value || task.key}'`
            };
            // * 这是公共的方式，大家都需要有的
            if (task.attrs?.required?.value) {
                itemAttrs.rules = `{[
                                {
                                    required: ${(task.attrs.required && task.attrs.required.value) || false},
                                    message: '${task.attrs.label && task.attrs.label.value}不能为空！'
                                }
                            ]}`;
            }
            if (task.attrs?.valuepropname?.value) {
                itemAttrs.valuePropName = `'${task.attrs?.valuepropname?.value}'`;
            }
            const itemAttrsStr = [];
            for (const key in itemAttrs) {
                if (Object.hasOwnProperty.call(itemAttrs, key)) {
                    const element = itemAttrs[key];
                    itemAttrsStr.push(`${key}=${element}`);
                }
            }
            items.push(
                `
                    <Col span={${valueOfSpan}}>
                        <Form.Item
                            ${itemAttrsStr.join('\n                            ')}
                        >
                            ${componentStr}
                        </Form.Item>
                    </Col>`
            );
            this.importCodeStr = StringService.addImportCodeStr(this.importCodeStr, task.importStr || '');
        }

        const bts = [];
        if (btnTasks.length > 0) {
            this.importCodeStr = StringService.addImportCodeStr(this.importCodeStr, btnTasks[0].importStr);
            btnTasks.forEach((task) => {
                let componentStr = _.cloneDeep(task.componentStr);
                // if (task.key === 'button') {
                //     componentStr = componentStr
                //         .replace(/>.*</g, `>${task.attrs.name.value}<`)
                //         .replace(/>/, ` type='${task.attrs.type.value}'>`)
                //         .replace(/>/, ` style={{marginRight: '16px'}} >`);
                // }
                bts.push(componentStr);
            });
            // 如果是按钮的话
            items.push(
                `
                    <Col span={24}>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            ${bts.join('')}
                        </Form.Item>
                    </Col>`
            );
        }
        if (items.length > 0) {
            this.importCodeStr = StringService.addImportCodeStr(this.importCodeStr, "import {Form,Row,Col} from 'antd';");
            return `                <Row gutter={{ xs: 8, sm: 16, md: 24 }}>${items.join('')}
                </Row>`;
        } else {
            return '';
        }
    };

    /**
     * 生成主要文件'index.js'的代码
     * @param {} sourceData
     */
    generateIndexCode = (sourceData, numberOfColumns) => {
        const begin1 = `
export default class FormDemo extends Component {
    formRef = React.createRef();`;

        const render1 = `    render() {`;

        const render3 = `
        return (
            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}  ref={this.formRef}>`;
        const end = `
            </Form>
        );
    }
}`;
        const contentCodeStr = this.generateAreaForm(sourceData['area-form'], numberOfColumns);
        this.indexCodeStr = `${this.importCodeStr}${begin1}${this.assistCodeStr}\n${render1}${render3}\n${contentCodeStr}${end}`;
    };
}
