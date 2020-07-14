import React from "react";
import {
  EditOutlined,
  SnippetsOutlined,
  TableOutlined,
  BlockOutlined,
  BulbOutlined,
} from "@ant-design/icons";

import TabDemo from "./components/demo/tab";
import Customize from "./components/customize";
import ReactBeautifulDndTest from "./components/test/reactBeautifulDndTest/";
import UsegestureTest from "./components/test/usegestureTest";

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
    path: "/default",
    name: "生成默认页面",
    icon: <SnippetsOutlined />,
    subset: [
      {
        path: "/default/normal-page",
        name: "普通列表页",
        icon: <TableOutlined />,
        component: TabDemo,
      },
    ],
  },
  {
    path: "/customize",
    name: "自定义生成页面",
    icon: <EditOutlined />,
    component: Customize,
  },
  {
    path: "/test1",
    name: "react-beautiful-dnd实验",
    icon: <BlockOutlined />,
    component: ReactBeautifulDndTest,
  },
  {
    path: "/test2",
    name: "use-gesture实验",
    icon: <BulbOutlined />,
    component: UsegestureTest,
  },
];

export default MENUS;
