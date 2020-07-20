import React from 'react';
import Sider from 'antd/lib/layout/Sider';
import { Menu, message } from 'antd';
import { OPTIONAL_CONPONENT_MENUS_DATA, INIT_DATA } from './optional-component-menus';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './index.less';
import styled from 'styled-components';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const { ItemGroup, Divider } = Menu;

const Content = styled.div`
    margin-right: 200px;
`;

const Handle = styled.div`
    display: flex;
    align-items: center;
    align-content: center;
    user-select: none;
    margin: -0.5rem 0.5rem -0.5rem -0.5rem;
    padding: 0.5rem;
    line-height: 1.5;
    border-radius: 3px 0 0 3px;
    background: #fff;
    border-right: 1px solid #ddd;
    color: #000;
`;

const List = styled.div`
    border: 1px ${(props) => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
    background: #fff;
    padding: 0.5rem 0.5rem 0;
    border-radius: 3px;
    flex: 0 0 150px;
    font-family: sans-serif;
`;

const Kiosk = styled(List)`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 200px;
`;
const Container = styled(List)`
    margin: 0.5rem 0.5rem 1.5rem;
`;

const Notice = styled.div`
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    padding: 0.5rem;
    margin: 0 0.5rem 0.5rem;
    border: 1px solid transparent;
    line-height: 1.5;
    color: #aaa;
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

    destClone.splice(droppableDestination.index, 0, { ...item, id: uuidv4(), key: uuidv4() });
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
    state = { ...INIT_DATA, [uuidv4()]: [] };
    onDragEnd = (result) => {
        const { source, destination } = result;
        // dropped outside the list
        if (!destination) {
            message.warning('目标区域没有找到');
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    [destination.droppableId]: reorder(this.state[source.droppableId], source.index, destination.index)
                });
                break;
            case 'areas-menus':
                debugger;
                this.setState({
                    [destination.droppableId]: copy(this.state.menus, this.state[destination.droppableId] || [], source, destination)
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
            <Droppable droppableId='areas-menus' isDropDisabled={true}>
                {(provided, snapshot) => (
                    <Sider className='site-layout-background' width={200}>
                        <Kiosk ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                            {OPTIONAL_CONPONENT_MENUS_DATA.map((group) => {
                                return (
                                    <div key={group.id2}>
                                        <h3>{group.title}</h3>
                                        {group.menus.map((menu, index) => {
                                            return (
                                                <Draggable key={menu.id2} draggableId={menu.id2} index={index}>
                                                    {(provided, snapshot) => (
                                                        <React.Fragment>
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
                        </Kiosk>
                        {provided.placeholder}
                    </Sider>
                )}
            </Droppable>
        );
    }

    renderArea(area) {
        return (
            <Droppable droppableId={area.id}>
                {(provided, snapshot) => (
                    <Container ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                        <span>{area.title}</span>
                        {area.taskIds.length > 0
                            ? area.taskIds.map((taskId, index) => {
                                  const task = this.getTask(taskId);
                                  return (
                                      <Draggable draggableId={task.id2} key={task.id2} index={index}>
                                          {(provided, snapshot) => (
                                              <Item
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  isDragging={snapshot.isDragging}
                                                  style={provided.draggableProps.style}
                                              >
                                                  <Handle {...provided.dragHandleProps}>
                                                      <svg width='24' height='24' viewBox='0 0 24 24'>
                                                          <path
                                                              fill='currentColor'
                                                              d='M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z'
                                                          />
                                                      </svg>
                                                  </Handle>
                                                  {task.component}
                                              </Item>
                                          )}
                                      </Draggable>
                                  );
                              })
                            : provided.placeholder && <Notice>Drop items here</Notice>}
                        {provided.placeholder}
                    </Container>
                )}
            </Droppable>
        );
    }

    renderOperateArea() {
        const area = this.state.areas['area-operate'];
        return (
            <Droppable droppableId={area.id}>
                {(provided, snapshot) => (
                    <Container ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                        <span>{area.title}</span>
                        {area.taskIds.length > 0
                            ? area.taskIds.map((taskId, index) => {
                                  const task = this.getTask(taskId);
                                  return (
                                      <Draggable draggableId={task.id2} key={task.id2} index={index}>
                                          {(provided, snapshot) => (
                                              <Item
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  isDragging={snapshot.isDragging}
                                                  style={provided.draggableProps.style}
                                              >
                                                  <Handle {...provided.dragHandleProps}>
                                                      <svg width='24' height='24' viewBox='0 0 24 24'>
                                                          <path
                                                              fill='currentColor'
                                                              d='M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z'
                                                          />
                                                      </svg>
                                                  </Handle>
                                                  {task.name}
                                              </Item>
                                          )}
                                      </Draggable>
                                  );
                              })
                            : provided.placeholder && <Notice>Drop items here</Notice>}
                        {provided.placeholder}
                    </Container>
                )}
            </Droppable>
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
            <div className='hyc-wrapper'>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {this.renderSider()}
                    <div className='customize-wrapper'>
                        {/* <div className='customize-operate-wrapper'>{this.renderOperateArea()}</div>
                         */}
                        {this.renderAreas()}
                    </div>
                </DragDropContext>
            </div>
        );
    }
}
