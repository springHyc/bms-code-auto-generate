import React from 'react';
import Sider from 'antd/lib/layout/Sider';
import { Menu } from 'antd';
import { OPTIONAL_CONPONENT_MENUS_DATA, INIT_DATA } from './optional-component-menus';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './index.less';
import styled from 'styled-components';
import _ from 'lodash';
import uuid from 'uuid/v4';

const { ItemGroup, Divider } = Menu;

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    transition: background-color 0.2s ease;
    background-color: ${(props) => (props.isDragDisabled ? 'lightgrey' : props.isDragging ? 'lightgreen' : 'white')};
`;

const Item = styled.div`
    display: flex;
    user-select: none;
    padding: 0.5rem;
    margin: 0 0 0.5rem 0;
    align-items: flex-start;
    align-content: flex-start;
    line-height: 1.5;
    border-radius: 3px;
    background: #fff;
    border: 1px ${(props) => (props.isDragging ? 'dashed #000' : 'solid #ddd')};
`;
const Clone = styled(Item)`
    + div {
        display: none !important;
    }
`;

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const copy = (source, destination, droppableSource, droppableDestination) => {
    debugger;
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, { ...item, id: uuid(), key: uuid() });
    return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
export default class Customize extends React.Component {
    state = INIT_DATA;
    onDragEnd = (result) => {
        const { source, destination } = result;
        debugger;

        // dropped outside the list
        if (!destination) {
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    [destination.droppableId]: reorder(this.state[source.droppableId], source.index, destination.index)
                });
                break;
            case 'MENUS':
                debugger;
                this.setState({
                    [destination.droppableId]: copy(this.state.menus, this.state[destination.droppableId], source, destination)
                });
                break;
            default:
                this.setState(move(this.state[source.droppableId], this.state[destination.droppableId], source, destination));
                break;
        }
    };

    getTask = (taskId) => {
        let task = { component: <div>我是谁？</div> };
        OPTIONAL_CONPONENT_MENUS_DATA.forEach((group) => {
            group.menus.forEach((menu) => {
                if (menu.key === taskId) {
                    task = menu;
                }
            });
        });

        return task;
    };
    renderSider1() {
        return (
            <Sider className='site-layout-background' width={200}>
                <Menu mode='inline' defaultSelectedKeys={['1']} defaultOpenKeys={['1-1']} style={{ height: '100%' }}>
                    {OPTIONAL_CONPONENT_MENUS_DATA.map((group) => {
                        return (
                            <ItemGroup title={group.title} key={group.key}>
                                <Divider />
                                {group.menus.map((menu) => {
                                    return <Menu.Item key={menu.key}>{menu.name}</Menu.Item>;
                                })}
                            </ItemGroup>
                        );
                    })}
                </Menu>
            </Sider>
        );
    }
    // 左侧可选择区域
    renderSider() {
        return (
            <Droppable droppableId='areas-menus' type='MENUS'>
                {(provided, snapshot) => (
                    <Sider className='site-layout-background' width={200}>
                        {OPTIONAL_CONPONENT_MENUS_DATA.map((group) => {
                            return (
                                <div ref={provided.innerRef}>
                                    <h3>{group.title}</h3>
                                    {group.menus.map((menu, index) => {
                                        return (
                                            <Draggable key={menu.key} draggableId={menu.key} index={menu.key}>
                                                {(provided, snapshot) => (
                                                    <React.Fragment>
                                                        {/* <Container
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={provided.innerRef}
                                                            isDragging={snapshot.isDragging}
                                                        >
                                                            {menu.name}
                                                        </Container> */}
                                                        <Item
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            isDragging={snapshot.isDragging}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            {menu.name}
                                                        </Item>
                                                        {snapshot.isDragging && <Clone>{menu.name}</Clone>}
                                                    </React.Fragment>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </Sider>
                )}
            </Droppable>
        );
    }

    renderArea(area) {
        return (
            <Droppable droppableId={area.id} type={area.id}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                        <span>{area.title}</span>
                        <div>
                            {area.taskIds.map((taskId, index) => {
                                const task = this.getTask(taskId);
                                return (
                                    <Draggable draggableId={task.key} key={task.key} index={index}>
                                        {(provided, snapshot) => (
                                            <Container
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                isDragging={snapshot.isDragging}
                                            >
                                                {task.component}
                                            </Container>
                                        )}
                                    </Draggable>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Droppable>
        );
    }

    renderOperateArea() {
        const area = this.state.areas['area-operate'];
        return (
            <div>
                <span>{area.title}</span>
                <Droppable droppableId={area.id} type={area.id}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                            {area.taskIds.map((taskId, index) => {
                                const task = this.getTask(taskId);
                                return (
                                    <Draggable draggableId={task.key} index={index}>
                                        {(provided, snapshot) => (
                                            <Container
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                isDragging={snapshot.isDragging}
                                            >
                                                {task.component}
                                            </Container>
                                        )}
                                    </Draggable>
                                );
                            })}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    }

    renderAreas() {
        const areas = _.cloneDeep(this.state.areas);
        let nodes = [];
        for (let key in areas) {
            if (key !== 'area-menus') {
                const area = areas[key];
                nodes.push(<div className='customize-operate-wrapper'>{this.renderArea(area)}</div>);
            }
        }
        return nodes;
    }
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className='hyc-wrapper'>
                    {this.renderSider()}
                    <div className='customize-wrapper'>
                        <div className='customize-operate-wrapper'>{this.renderOperateArea()}</div>
                    </div>
                </div>
            </DragDropContext>
        );
    }
}
