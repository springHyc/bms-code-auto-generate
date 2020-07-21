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
    const sourceClone = Array.from(source); // 这个地方的顺序有问题，还是要是一个列表没问题
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];
    destClone.splice(droppableDestination.index, 0, { ...item, id: uuidv4() });
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
    state = { ...INIT_DATA };
    onDragEnd = (result) => {
        const { source, destination } = result;
        // dropped outside the list
        if (!destination) {
            message.warning('目标区域没有找到');
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId: {
                const resultTasks = reorder(this.state.areas[source.droppableId].tasks, source.index, destination.index);
                const areas = this.state.areas;
                areas[destination.droppableId].tasks = resultTasks;
                this.setState({ areas: areas });
                break;
            }
            case 'areas-menus': {
                const destClone = copy(this.state.menus, this.state[destination.droppableId] || [], source, destination);
                const areas = this.state.areas;
                areas[destination.droppableId].tasks = areas[destination.droppableId].tasks.concat(destClone);
                this.setState({ areas: areas });
                break;
            }
            default:
                this.setState(move(this.state[source.droppableId], this.state[destination.droppableId], source, destination));
                break;
        }
    };

    // renderSider1() {
    //     return (
    //         <Sider className='site-layout-background' width={200}>
    //             <Menu mode='inline' defaultSelectedKeys={['1']} defaultOpenKeys={['1-1']} style={{ height: '100%' }}>
    //                 {OPTIONAL_CONPONENT_MENUS_DATA.map((group) => {
    //                     return (
    //                         <ItemGroup title={group.title} key={group.key}>
    //                             <Divider />
    //                             {group.menus.map((menu) => {
    //                                 return <Menu.Item key={menu.key}>{menu.name}</Menu.Item>;
    //                             })}
    //                         </ItemGroup>
    //                     );
    //                 })}
    //             </Menu>
    //         </Sider>
    //     );
    // }
    // 左侧可选择区域
    renderSider() {
        const menus = this.state.menus;
        return (
            <Droppable droppableId='areas-menus' isDropDisabled={true}>
                {(provided, snapshot) => (
                    <Sider className='site-layout-background' width={200}>
                        <Kiosk ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                            {menus.map((menu, index) => {
                                return (
                                    <Draggable key={menu.id} draggableId={menu.id} index={index}>
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
                        </Kiosk>
                        {provided.placeholder}
                    </Sider>
                )}
            </Droppable>
        );
        // return (
        //     <Droppable droppableId='areas-menus' isDropDisabled={true}>
        //         {(provided, snapshot) => (
        //             <Sider className='site-layout-background' width={200}>
        //                 <Kiosk ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
        //                     {OPTIONAL_CONPONENT_MENUS_DATA.map((group) => {
        //                         return (
        //                             <div key={group.id}>
        //                                 <h3>{group.title}</h3>
        //                                 {group.menus.map((menu, index) => {
        //                                     return (
        //                                         <Draggable key={menu.id} draggableId={menu.id} index={menu.index}>
        //                                             {(provided, snapshot) => (
        //                                                 <React.Fragment>
        //                                                     <Item
        //                                                         ref={provided.innerRef}
        //                                                         {...provided.draggableProps}
        //                                                         {...provided.dragHandleProps}
        //                                                         isDragging={snapshot.isDragging}
        //                                                         style={provided.draggableProps.style}
        //                                                     >
        //                                                         {menu.name}
        //                                                     </Item>
        //                                                     {snapshot.isDragging && <Clone>{menu.name}</Clone>}
        //                                                 </React.Fragment>
        //                                             )}
        //                                         </Draggable>
        //                                     );
        //                                 })}
        //                             </div>
        //                         );
        //                     })}
        //                 </Kiosk>
        //                 {provided.placeholder}
        //             </Sider>
        //         )}
        //     </Droppable>
        // );
    }

    renderArea(area) {
        return (
            <Droppable droppableId={area.id} key={area.id} className={area.className}>
                {(provided, snapshot) => (
                    // <Container ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                    <div
                        ref={provided.innerRef}
                        className={area.className}
                        style={{ border: `1px ${snapshot.isDraggingOver ? 'dashed #000' : 'solid #ddd'}` }}
                    >
                        <span className='title'>{area.title}</span>
                        {area.tasks.length > 0
                            ? area.tasks.map((task, index) => {
                                  return (
                                      <Draggable draggableId={task.id} key={task.id} index={task.index}>
                                          {(provided, snapshot) => (
                                              <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  style={{
                                                      ...provided.draggableProps.style,
                                                      border: `1px ${snapshot.isDragging ? 'dashed #000' : 'solid #ddd'}`
                                                  }}
                                                  {...provided.dragHandleProps}
                                              >
                                                  {task.component}
                                              </div>
                                          )}
                                      </Draggable>
                                  );
                              })
                            : provided.placeholder && <Notice>Drop items here</Notice>}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    }

    renderAreas() {
        const areas = _.cloneDeep(this.state.areas);
        let nodes = [];
        for (let key in areas) {
            const area = areas[key];
            nodes.push(this.renderArea(area));
        }
        return nodes;
    }
    render() {
        return (
            <div className='hyc-wrapper'>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {this.renderSider()}
                    <div className='customize-wrapper'>{this.renderAreas()}</div>
                </DragDropContext>
            </div>
        );
    }
}
