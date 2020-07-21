import React from 'react';
import { Button, Input, DatePicker, InputNumber, Radio, Switch } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const { RangePicker } = DatePicker;

const OPTIONAL_CONPONENT_MENUS_DATA = [
    {
        title: '通用',
        id: 1,
        key: '1',
        menus: [{ index: 0, id: uuidv4(), key: '1-1', name: 'Button 按钮', component: <Button>新增</Button> }]
    },
    {
        title: '数据录入',
        id: 2,
        key: '2',
        menus: [
            { index: 1, id: uuidv4(), key: '2-1', name: 'Input 输入框', component: <Input placeholder='请输入' /> },
            {
                index: 2,
                id: uuidv4(),
                key: '2-2',
                name: 'Checkbox 多选框',
                component: <span>this is Checkbox</span>
            },
            {
                index: 3,
                id: uuidv4(),
                key: '2-3',
                name: 'DatePicker 日期选择框',
                component: <RangePicker />
            },
            {
                index: 4,
                id: uuidv4(),
                key: '2-4',
                name: 'InputNumber 数字输入框',
                component: <InputNumber />
            },
            {
                index: 5,
                id: uuidv4(),
                key: '2-5',
                name: 'Radio 单选框',
                component: (
                    <Radio.Group>
                        <Radio value={1}>A</Radio>
                        <Radio value={2}>B</Radio>
                        <Radio value={3}>C</Radio>
                        <Radio value={4}>D</Radio>
                    </Radio.Group>
                )
            },
            {
                index: 6,
                id: uuidv4(),
                key: '2-6',
                name: 'Switch 开关',
                component: <Switch defaultChecked />
            },
            {
                index: 7,
                id: uuidv4(),
                key: '2-7',
                name: 'Select 选择器'
            }
        ]
    },
    {
        title: '数据展示',
        id: 3,
        key: '3',
        menus: [
            { index: 8, id: uuidv4(), key: '3-1', name: 'Tabs 标签页' },
            { index: 9, id: uuidv4(), key: '3-2', name: 'Table 表格' }
        ]
    }
];
function getMenusIds() {
    const taskIds = [];
    OPTIONAL_CONPONENT_MENUS_DATA.forEach((group) => {
        group.menus.forEach((menu) => {
            taskIds.push(menu.key);
        });
    });
    return taskIds;
}

function getMenus() {
    const tasks = [];
    let _index = 0;
    OPTIONAL_CONPONENT_MENUS_DATA.forEach((group, index) => {
        group.menus.forEach((menu, index2) => {
            tasks.push({ ...menu, index: _index });
            _index++;
        });
    });
    return tasks;
}

const INIT_DATA = {
    menus: getMenus(),
    areas: {
        'area-operate': {
            id: 'area-operate',
            className: 'customize-operate-wrapper',
            title: '按钮操作区域',
            tasks: []
        },
        'area-search': {
            id: 'area-search',
            className: 'customize-search-wrapper',
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
