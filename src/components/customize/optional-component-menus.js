import React from 'react';
import { Button, Input, DatePicker, InputNumber, Radio, Switch, Select, Table, Tabs } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import columns from './assistFile/columns';
import Data from './assistFile/mockTableData';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const pageSizeOptions = ['10', '20', '50', '100'];
const pageInfo = { pageSize: 10, pageNum: 1 };

const OPTIONAL_CONPONENT_MENUS_DATA = [
    {
        title: '通用',
        id: 1,
        key: '1',
        menus: [
            {
                id: uuidv4(),
                key: 'button',
                name: 'Button 按钮',
                component: <Button type='primary'>新增</Button>,
                // 属性
                attrs: [
                    { id: uuidv4(), name: '按钮文本', type: 'string', required: true, value: '按钮文本' },
                    { id: uuidv4(), name: 'type', type: 'string', required: false, value: 'primary' },
                    {
                        id: uuidv4(),
                        name: 'onClick事件',
                        type: 'function', // todo 生成diamante时是：() => {}
                        required: false,
                        value: ''
                    }
                ]
            }
        ]
    },
    {
        title: '数据录入',
        id: 2,
        key: '2',
        menus: [
            { id: uuidv4(), name: 'Input 输入框', component: <Input placeholder='请输入' /> },
            {
                id: uuidv4(),
                name: 'Checkbox 多选框',
                component: <span>this is Checkbox</span>
            },
            {
                id: uuidv4(),
                name: 'DatePicker 日期选择框',
                component: <RangePicker />
            },
            {
                id: uuidv4(),
                name: 'InputNumber 数字输入框',
                component: <InputNumber placeholder='请填写数字' />
            },
            {
                id: uuidv4(),
                name: 'Radio 单选框',
                component: (
                    <Radio.Group placeholder='单选'>
                        <Radio value={1}>A</Radio>
                        <Radio value={2}>B</Radio>
                        <Radio value={3}>C</Radio>
                        <Radio value={4}>D</Radio>
                    </Radio.Group>
                )
            },
            {
                id: uuidv4(),
                name: 'Switch 开关',
                component: <Switch defaultChecked />
            },
            {
                id: uuidv4(),
                name: 'Select 选择器',
                component: (
                    <Select style={{ width: 120 }} placeholder='Select'>
                        <Option value='jack'>Jack</Option>
                        <Option value='lucy'>Lucy</Option>
                        <Option value='disabled' disabled>
                            Disabled
                        </Option>
                        <Option value='Yiminghe'>yiminghe</Option>
                    </Select>
                )
            }
        ]
    },
    {
        title: '数据展示',
        id: 3,
        key: '3',
        menus: [
            {
                id: uuidv4(),
                name: 'Tabs 标签页',
                component: (
                    <Tabs
                        type='card'
                        animated={true}
                        className='br-tabs'
                        onChange={() => {
                            // * 将值存储到redux中，这样当从某个tab进入详情后，退回，还能退回这个tab标签
                        }}
                    >
                        <TabPane tab='标签展示1' key='1'>
                            {/* <span>标签展示1</span> */}
                        </TabPane>
                        <TabPane tab='标签展示2' key='2'>
                            <span>标签展示2</span>
                        </TabPane>
                        <TabPane tab='标签展示3' key='3'>
                            <span>标签展示3</span>
                        </TabPane>
                    </Tabs>
                )
            },
            {
                id: uuidv4(),
                name: 'Table 表格',
                component: (
                    <Table
                        rowKey={(row) => row.id}
                        columns={columns}
                        dataSource={Data.dataList}
                        locale={{ emptyText: '暂无数据' }}
                        className='br-table-wrapper'
                        pagination={{
                            showSizeChanger: true,
                            current: pageInfo.pageNum,
                            // onChange: this.onPageChange,
                            // onShowSizeChange: this.onShowSizeChange,
                            total: Number(Data.totalCount),
                            pageSizeOptions: pageSizeOptions,
                            showQuickJumper: true, // 添加
                            showTotal(total) {
                                return `共 ${total} 条`; // 统一文字
                            }
                        }}
                        scroll={{ scrollToFirstRowOnChange: true }} // 添加
                    />
                )
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
            tasks: []
        },
        'area-search': {
            id: 'area-search',
            className: 'customize-search-wrapper br-select-container',
            title: '搜索区域',
            tasks: []
        },
        'area-table': {
            id: 'area-table',
            className: 'customize-table-wrapper',
            title: 'Table区域',
            tasks: []
        }
    }
};

export { OPTIONAL_CONPONENT_MENUS_DATA, INIT_DATA };
