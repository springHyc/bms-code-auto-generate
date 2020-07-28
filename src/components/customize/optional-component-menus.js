import React from 'react';
import { Button, Input, DatePicker, InputNumber, Radio, Switch, Select } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OPTIONAL_CONPONENT_MENUS_DATA = [
    {
        title: '通用',
        id: 1,
        key: '1',
        menus: [
            {
                id: uuidv4(),
                name: 'Button 按钮',
                component: (
                    <Button type='primary' onClick={(e) => e.preventDefault()}>
                        新增
                    </Button>
                )
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
            { id: uuidv4(), name: 'Tabs 标签页' },
            { id: uuidv4(), name: 'Table 表格' }
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
