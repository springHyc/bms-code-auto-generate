import React from 'react';
import { Button, Input } from 'antd';

const OPTIONAL_CONPONENT_MENUS_DATA = [
    {
        title: '通用',
        key: '1',
        menus: [{ key: '1-1', name: 'Button 按钮', component: <Button>新增</Button> }]
    },
    {
        title: '数据录入',
        key: '2',
        menus: [
            { key: '2-1', name: 'Input 输入框', component: <Input placeholder='请输入' /> },
            {
                key: '2-2',
                name: 'Checkbox 多选框'
            },
            {
                key: '2-3',
                name: 'DatePicker 日期选择框'
            },
            {
                key: '2-4',
                name: 'InputNumber 数字输入框'
            },
            {
                key: '2-5',
                name: 'Radio 单选框'
            },
            {
                key: '2-6',
                name: 'Switch 开关'
            },
            {
                key: '2-7',
                name: 'Select 选择器'
            }
        ]
    },
    {
        title: '数据展示',
        key: '3',
        menus: [
            { key: '3-1', name: 'Tabs 标签页' },
            { key: '3-2', name: 'Table 表格' }
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
