import React from 'react';
import { HomeOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import TabDemo from './components/demo/tab';
/**
 * 整个路由走的是hash路由。
 * path:导航路径，必填
 * name: 展示在左侧导航栏的名称， 必填
 * icon: 对应的图标， 必填
 * component： 对应页面的组件，非必填，如果有二级menu则不必填，如果没有则必填，不然无法展示
 * subset：二级menu，目前仅支持二级menu，里面参数同上
 *
 */
const MENUS = [
  {
    path: '/demo1',
    name: 'DEMO1',
    icon: <QuestionCircleOutlined />,
    component: TabDemo,
  },
  {
    path: '/demo2',
    name: 'DEMO2',
    icon: <QuestionCircleOutlined />,
    subset: [
      {
        path: '/demo2/tab',
        name: 'Tab',
        icon: <HomeOutlined />,
        component: TabDemo,
      },
    ],
  },
];

export default MENUS;
