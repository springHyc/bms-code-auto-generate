import React from 'react';
import { Button, Input, DatePicker, InputNumber, Select, Radio, Checkbox, Switch, Rate } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { BrCheckboxAll, BrUploadFile, BrUploadImage } from '@bairong/bmsui';

const OPTIONAL_CONPONENT_MENUS_DATA = [
    {
        title: '通用',
        id: 1,
        key: '1',
        menus: [
            {
                id: uuidv4(),
                key: 'button', // 需要它来确定这是个button组件
                name: 'Button 按钮',
                component: <Button></Button>,
                importStr: "import { Button } from 'antd';",
                // 属性
                attrs: {
                    name: { id: uuidv4(), text: '按钮文本', type: 'string', required: true, value: '保存' },
                    type: {
                        id: uuidv4(),
                        text: 'type',
                        type: 'select',
                        required: false,
                        value: 'primary',
                        options: ['primary', 'ghost', 'dashed', 'danger', 'link', 'text', 'default']
                    },
                    onClick: {
                        id: uuidv4(),
                        text: 'onClick事件',
                        type: 'function', // todo 生成代码时是：() => {}
                        required: false,
                        value: ''
                    }
                }
            }
        ]
    },
    {
        title: '数据录入',
        id: 2,
        key: '2',
        menus: [
            {
                id: uuidv4(),
                key: 'text-show',
                name: '纯文字展示',
                component: <span className='ant-form-text'>China</span>,
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '纯文本' },
                    children: { id: uuidv4(), text: '展示文案', type: 'string', required: true, value: 'China' }
                }
            },
            {
                id: uuidv4(),
                key: 'rate',
                name: '评分',
                component: <Rate value={3} />,
                componentStr: '<Rate ></Rate>',
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: 3 }
                }
            },
            {
                id: uuidv4(),
                key: 'input',
                name: 'Input 输入框',
                component: <Input />,
                componentStr: '<Input></Input>',
                importStr: "import {Input} from 'antd';",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    placeholder: {
                        id: uuidv4(),
                        key: 'placeholder',
                        text: 'placeholder',
                        type: 'string',
                        required: false,
                        value: '请输入'
                    },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' }
                }
            },
            {
                id: uuidv4(),
                key: 'input.textarea',
                name: 'TextArea',
                component: <Input.TextArea rows={4}></Input.TextArea>,
                componentStr: '<Input.TextArea rows={4}></Input.TextArea>',
                importStr: "import {Input} from 'antd';",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    placeholder: {
                        id: uuidv4(),
                        key: 'placeholder',
                        text: 'placeholder',
                        type: 'string',
                        required: false,
                        value: '请输入'
                    },
                    rows: {
                        id: uuidv4(),
                        key: 'rows',
                        text: 'rows',
                        type: 'number',
                        required: false,
                        value: 4 // 默认值
                    },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' }
                }
            },
            {
                id: uuidv4(),
                key: 'datepicker',
                name: 'DatePicker.RangePicker',
                component: <DatePicker.RangePicker />,
                componentStr: '<DatePicker.RangePicker></DatePicker.RangePicker>',
                importStr: "import {DatePicker} from 'antd';",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' }
                }
            },
            {
                id: uuidv4(),
                key: 'datepicker',
                name: 'DatePicker',
                component: <DatePicker />,
                componentStr: '<DatePicker></DatePicker>',
                importStr: "import {DatePicker} from 'antd';",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' }
                }
            },
            {
                id: uuidv4(),
                key: 'input',
                name: 'InputNumber',
                component: <InputNumber />,
                componentStr: '<InputNumber></InputNumber>',
                importStr: "import {InputNumber} from 'antd';",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    placeholder: {
                        id: uuidv4(),
                        key: 'placeholder',
                        text: 'placeholder',
                        type: 'string',
                        required: false,
                        value: '请填写数字'
                    },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' }
                }
            },
            {
                id: uuidv4(),
                name: 'Checkbox.Group',
                key: 'checkbox',
                component: <Checkbox.Group></Checkbox.Group>,
                componentStr: `<Checkbox></Checkbox>`,
                importStr: "import {Checkbox} from 'antd';",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    placeholder: {
                        id: uuidv4(),
                        key: 'placeholder',
                        text: 'placeholder',
                        type: 'string',
                        required: false,
                        value: '请下拉选择'
                    },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' },
                    children: {
                        id: uuidv4(),
                        type: 'checkbox-children',
                        key: 'option',
                        required: false,
                        value: [
                            <Checkbox value='A'>A</Checkbox>,
                            <Checkbox value='B'>B</Checkbox>,
                            <Checkbox value='C'>C</Checkbox>,
                            <Checkbox value='D'>D</Checkbox>
                        ]
                    }
                }
            },
            {
                id: uuidv4(),
                name: 'Checkbox.Group+全选',
                key: 'checkbox',
                component: (
                    <BrCheckboxAll
                        data={[
                            { id: 1, name: 'A' },
                            { id: 2, name: 'B' },
                            { id: 3, name: 'C' },
                            { id: 4, name: 'E' }
                        ]}
                    ></BrCheckboxAll>
                ),
                componentStr: `<Checkbox></Checkbox>`,
                importStr: "import {BrCheckboxAll} from '@bairong/bmsui'; ",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' }
                }
            },
            {
                id: uuidv4(),
                name: 'Radio 单选框',
                component: (
                    <Radio.Group placeholder='单选'>
                        <Radio value={1} key={1}>
                            A
                        </Radio>
                        <Radio value={2} key={2}>
                            B
                        </Radio>
                        <Radio value={3} key={3}>
                            C
                        </Radio>
                        <Radio value={4} key={4}>
                            D
                        </Radio>
                    </Radio.Group>
                ),
                componentStr: `<Radio.Group placeholder='单选'>
                                    <Radio value={1}>A</Radio>
                                    <Radio value={2}>B</Radio>
                                    <Radio value={3}>C</Radio>
                                    <Radio value={4}>D</Radio>
                                </Radio.Group>`,
                importStr: "import {Radio} from 'antd';",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' }
                }
            },
            {
                id: uuidv4(),
                name: 'Switch 开关',
                component: <Switch defaultChecked />,
                componentStr: '<Switch defaultChecked />',
                importStr: "import {Switch} from 'antd';",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' }
                }
            },
            {
                id: uuidv4(),
                name: 'Select 选择器',
                key: 'select',
                component: <Select></Select>,
                componentStr: `<Select></Select>`,
                importStr: "import {Select} from 'antd';",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    placeholder: {
                        id: uuidv4(),
                        key: 'placeholder',
                        text: 'placeholder',
                        type: 'string',
                        required: false,
                        value: '请下拉选择'
                    },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' },
                    options: { id: uuidv4(), type: 'option', key: 'option', required: false, value: [] }
                }
            },
            {
                id: uuidv4(),
                name: '上传文件',
                key: 'upload',
                component: <BrUploadFile></BrUploadFile>,
                componentStr: `<BrUploadFile></BrUploadFile>`,
                importStr: "import {BrUploadFile} from '@bairong/bmsui'; ",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' }
                }
            },
            {
                id: uuidv4(),
                name: '上传图片',
                key: 'upload',
                component: <BrUploadImage></BrUploadImage>,
                componentStr: `<BrUploadImage></BrUploadImage>`,
                importStr: "import {BrUploadImage} from '@bairong/bmsui'; ",
                attrs: {
                    label: { id: uuidv4(), key: 'label', text: 'label: 标签名', type: 'string', required: true, value: '名字自取' },
                    name: { id: uuidv4(), key: 'name', text: 'name: 字段名', type: 'string', required: true, value: '' },
                    required: { id: uuidv4(), key: 'required', text: 'required: 校检', type: 'checkbox', required: false, value: false },
                    default: { id: uuidv4(), key: 'default', text: 'default: 默认值', type: 'string', required: false, value: '' }
                }
            }
        ]
    }
];

function getMenus() {
    const tasks = [];
    OPTIONAL_CONPONENT_MENUS_DATA.forEach((group) => {
        group.menus.forEach((menu) => {
            tasks.push(menu);
        });
    });
    return tasks;
}

const INIT_DATA = {
    menus: getMenus(),
    areas: {
        'area-form': {
            id: 'area-form',
            className: 'customize-area-form-wrapper',
            title: 'Form表单区域',
            tasks: []
            // canExistKeys: ['button']
        }
        // 'area-operate': {
        //     id: 'area-operate',
        //     className: 'customize-operate-wrapper br-operate-container ',
        //     title: '按钮操作区域',
        //     tasks: [],
        //     canExistKeys: ['button']
        // },
        // // 搜索区域一般的组件：Date(年月日、年月)、select、input
        // 'area-search': {
        //     id: 'area-search',
        //     className: 'customize-search-wrapper br-select-container',
        //     title: '搜索区域',
        //     tasks: [],
        //     canExistKeys: ['input', 'datepicker', 'select']
        // },
        // 'area-table': {
        //     id: 'area-table',
        //     className: 'customize-table-wrapper',
        //     title: 'Table区域',
        //     tasks: [],
        //     canExistKeys: ['table']
        // }
    }
};

export { OPTIONAL_CONPONENT_MENUS_DATA, INIT_DATA };