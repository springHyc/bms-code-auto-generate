import React from 'react';
import Sider from 'antd/lib/layout/Sider';
import { Menu } from 'antd';
import OPTIONAL_CONPONENT_MENUS_DATA from './optional-component-menus';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './index.less';

const { ItemGroup, Divider } = Menu;
export default class Customize extends React.Component {
    // 左侧可选择区域
    renderSider() {
        return (
            <Droppable droppableId='menus' type='TASK'>
                {(provided, snapshot) => (
                    <Sider className='site-layout-background' width={200} ref={provided.innerRef}>
                        <Menu mode='inline' defaultSelectedKeys={['1']} defaultOpenKeys={['1-1']} style={{ height: '100%' }}>
                            {OPTIONAL_CONPONENT_MENUS_DATA.map((group) => {
                                return (
                                    <ItemGroup title={group.title} key={group.key}>
                                        <Divider />
                                        {group.menus.map((menu) => {
                                            return (
                                                <Draggable draggableId={menu.key}>
                                                    {(provided, snapshot) => (
                                                        <Menu.Item ref={provided.innerRef} key={menu.key}>
                                                            {menu.name}
                                                        </Menu.Item>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                    </ItemGroup>
                                );
                            })}
                        </Menu>
                    </Sider>
                )}
            </Droppable>
        );
    }
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className='hyc-wrapper'>
                    {this.renderSider()}
                    <div className='customize-wrapper'>
                        <div className='customize-operate-wrapper'>
                            <span>ccc</span>
                        </div>
                        <div className='customize-search-wrapper'>
                            <span>ccc</span>
                        </div>
                        <div className='customize-table-wrapper'>
                            <span>ccc</span>
                        </div>
                    </div>
                </div>
            </DragDropContext>
        );
    }
}
