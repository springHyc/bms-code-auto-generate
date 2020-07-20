import React from 'react';
import { Button, Input } from 'antd';

const OPTIONAL_CONPONENT_MENUS_DATA = [
    {
        title: '通用',
        id: 1,
        key: '1',
        menus: [{ id: 11, key: '1-1', name: 'Button 按钮', component: <Button>新增</Button> }]
    },
    {
        title: '数据录入',
        id: 2,
        key: '2',
        menus: [
            { id: 21, key: '2-1', name: 'Input 输入框', component: <Input placeholder='请输入' /> },
            {
                id: 22,
                key: '2-2',
                name: 'Checkbox 多选框'
            },
            {
                id: 23,
                key: '2-3',
                name: 'DatePicker 日期选择框'
            },
            {
                id: 24,
                key: '2-4',
                name: 'InputNumber 数字输入框'
            },
            {
                id: 25,
                key: '2-5',
                name: 'Radio 单选框'
            },
            {
                id: 26,
                key: '2-6',
                name: 'Switch 开关'
            },
            {
                id: 27,
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
            { id: 31, key: '3-1', name: 'Tabs 标签页' },
            { id: 32, key: '3-2', name: 'Table 表格' }
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
        'area-menus': {
            id: 'areas-menus',
            title: 'Menus',
            taskIds: getMenusIds()
        },
        'area-operate': {
            id: 'area-operate',
            title: '按钮操作区域',
            taskIds: []
        },
        'area-search': {
            id: 'area-search',
            title: '搜索区域',
            taskIds: []
        },
        'area-table': {
            id: 'area-table',
            title: 'Table区域',
            taskIds: []
        }
    }
};

export { OPTIONAL_CONPONENT_MENUS_DATA, INIT_DATA };
