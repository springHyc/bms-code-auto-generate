import React from 'react';
import { Button, Input, DatePicker, InputNumber, Select, Table } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import columns from './assistFile/columns';
import data from './assistFile/mockTableData';

const pageInfo = { pageSize: 10, pageNum: 1 };

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
                component: <Button />,
                importStr: "import { Button } from 'antd';",
                // 属性
                attrs: {
                    name: { id: uuidv4(), text: '按钮文本', type: 'string', required: true, value: '按钮文本' },
                    type: {
                        id: uuidv4(),
                        text: 'type',
                        type: 'select',
                        required: false,
                        value: 'default',
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
            // {
            //     // TODO这个暂时在搜索区域没用过
            //     id: uuidv4(),
            //     name: 'Checkbox 多选框',
            //     component: <span>this is Checkbox</span>
            // },
            {
                id: uuidv4(),
                key: 'datepicker',
                name: 'DatePicker 日期选择框',
                component: <DatePicker.RangePicker />,
                componentStr: '<DatePicker.RangePicker></DatePicker.RangePicker>',
                importStr: "import {DatePicker} from 'antd';", // todo是否需要多引入单个年月日的
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
                name: 'InputNumber 数字输入框',
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
            // TODO 搜索区域暂时没有
            // {
            //
            //     id: uuidv4(),
            //     name: 'Radio 单选框',
            //     component: (
            //         <Radio.Group placeholder='单选'>
            //             <Radio value={1}>A</Radio>
            //             <Radio value={2}>B</Radio>
            //             <Radio value={3}>C</Radio>
            //             <Radio value={4}>D</Radio>
            //         </Radio.Group>
            //     )
            // },
            // {
            //     id: uuidv4(),
            //     name: 'Switch 开关',
            //     component: <Switch defaultChecked />
            // },
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
            }
        ]
    },
    {
        title: '数据展示',
        id: 3,
        key: '3',
        menus: [
            // {
            //     id: uuidv4(),
            //     name: 'Tabs 标签页',
            //     component: (
            //         <Tabs
            //             type='card'
            //             animated={true}
            //             className='br-tabs'
            //             onChange={() => {
            //                 // * 将值存储到redux中，这样当从某个tab进入详情后，退回，还能退回这个tab标签
            //             }}
            //         >
            //             <TabPane tab='标签展示1' key='1'>
            //                 {/* <span>标签展示1</span> */}
            //             </TabPane>
            //             <TabPane tab='标签展示2' key='2'>
            //                 <span>标签展示2</span>
            //             </TabPane>
            //             <TabPane tab='标签展示3' key='3'>
            //                 <span>标签展示3</span>
            //             </TabPane>
            //         </Tabs>
            //     )
            // },
            {
                id: uuidv4(),
                name: 'Table 表格',
                key: 'table',
                component: (
                    <Table
                        rowKey={(row) => row.id}
                        columns={columns}
                        dataSource={data.dataList}
                        locale={{ emptyText: '暂无数据' }}
                        className='br-table-wrapper'
                        pagination={{
                            showSizeChanger: true,
                            current: pageInfo.pageNum,
                            // onChange: this.onPageChange,
                            // onShowSizeChange: this.onShowSizeChange,
                            total: Number(data.totalCount),
                            pageSizeOptions: ['10', '20', '50', '100', '200'],
                            showQuickJumper: true, // 添加
                            showTotal(total) {
                                return `共 ${total} 条`; // 统一文字
                            }
                        }}
                        scroll={{ scrollToFirstRowOnChange: true }} // 添加
                    />
                ),
                importStr: "import {Table} from 'antd';",
                componentStr: `
                <Table
                    rowKey={(row) => row.id}
                    columns={columns}
                    dataSource={data && data.dataList}
                    locale={{ emptyText: '暂无数据' }}
                    className='br-table-wrapper'
                    pagination={{
                        showSizeChanger: true,
                        current: this.pageInfo.pageNum,
                        total: Number(data.totalCount),
                        pageSizeOptions: ['10', '20', '50', '100', '200'],
                        showQuickJumper: true,
                        showTotal(total) {
                            return \`共 \${total} 条\`;
                        }
                    }}
                    scroll={{ scrollToFirstRowOnChange: true }} // 添加
                />`,
                attrs: {
                    columns: [
                        {
                            title: '代理公司',
                            dataIndex: 'channelCompanyName'
                        },
                        {
                            title: '应用名称',
                            dataIndex: 'channelAppName'
                        }
                    ],
                    operate: []
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
        'area-operate': {
            id: 'area-operate',
            className: 'customize-operate-wrapper br-operate-container ',
            title: '按钮操作区域',
            tasks: [],
            canExistKeys: ['button']
        },
        // 搜索区域一般的组件：Date(年月日、年月)、select、input
        'area-search': {
            id: 'area-search',
            className: 'customize-search-wrapper br-select-container',
            title: '搜索区域',
            tasks: [],
            canExistKeys: ['input', 'datepicker', 'select']
        },
        'area-table': {
            id: 'area-table',
            className: 'customize-table-wrapper',
            title: 'Table区域',
            tasks: [],
            canExistKeys: ['table']
        }
    }
};

export { OPTIONAL_CONPONENT_MENUS_DATA, INIT_DATA };
