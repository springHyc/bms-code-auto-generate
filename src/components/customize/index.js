import React from 'react';
import Sider from 'antd/lib/layout/Sider';
import { message, Form, Row, Col, Button, Tabs } from 'antd';
import { INIT_DATA } from './optional-component-menus';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './index.less';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Clone, Item, Notice, Kiosk } from './common';
import ComponentAttrsConfig from './componentAttrsConfig';

const { TabPane } = Tabs;

/**
 * 添加点击事件
 * @param {} component
 */
const addOnClickComponent = (item, newId, that, droppableId) => {
    const _component = _.cloneDeep(item.component);
    if (item.key === 'datepicker') {
        // ? 不好使
        _component.props = {
            ..._component.props,
            // 添加点击事件
            focus: (e) => {
                that.setState({ selectedNode: { node: { ...item, id: newId }, area: droppableId } });
                e.preventDefault();
            }
        };
    } else {
        _component.props = {
            ..._component.props,
            // 添加点击事件
            onClick: (e) => {
                that.setState({ selectedNode: { node: { ...item, id: newId }, area: droppableId } });
                e.preventDefault();
            }
        };
    }

    return _component;
};

/**
 * 同一区域内排序
 */
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

/**
 * 从左侧栏复制到右侧可移动区域
 */
const copy = (source, destination, droppableSource, droppableDestination, that) => {
    const sourceClone = Array.from(source); // 这个地方的顺序有问题，还是要是一个列表没问题
    const destClone = Array.from(destination);
    const item = _.cloneDeep(sourceClone[droppableSource.index]);
    const newId = uuidv4();
    const newComponent = addOnClickComponent(item, newId, that, droppableDestination.droppableId);
    destClone.splice(droppableDestination.index, 0, { ...item, id: newId, component: newComponent });
    return destClone;
};
/**
 * Moves an item from one list to another list.
 */
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
    state = { ...INIT_DATA, selectedNode: { node: {} } };
    formRef = React.createRef();

    getNewComponent = (task, areaId) => {
        // 展示的时候，从新渲染组件
        // 得专门的组件来专门做
        // 可以名称的对应上，然后来做
        const _component = _.cloneDeep(task.component);
        if (task.key === 'button' && areaId === 'area-operate') {
            // A：按钮区域
            _component.props = {
                ..._component.props,
                children: task.attrs[0].value,
                type: task.attrs[1].value
            };
        }

        return _component;
    };

    getNewComponentOfAreaSearch = (task, areaId) => {
        const _component = _.cloneDeep(task.component);
        const formItemAttrs = {};
        if (areaId === 'area-search') {
            task &&
                task.attrs &&
                task.attrs.forEach((item) => {
                    if (item.key === 'name' || item.key === 'label') {
                        formItemAttrs[item.key] = item.value;
                    } else if (item.key === 'required') {
                        // 样例
                        // rules={[{ required: true, message: '最少2个字符' }]}
                        formItemAttrs['rules'] = [
                            {
                                required: item.value,
                                message: '不能为空！'
                            }
                        ];
                    } else {
                        _component.props = {
                            ..._component.props,
                            [item.key]: item.value
                        };
                    }
                });
        }
        return { component: _component, formItemAttrs: formItemAttrs };
    };
    updateArea = (key, tasks) => {
        const areas = this.state.areas;
        areas[key].tasks = tasks;
        this.setState({ areas: areas });
    };

    /**
     * 移动时
     */
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
                this.updateArea(destination.droppableId, resultTasks);
                break;
            }
            case 'areas-menus': {
                const destClone = copy(this.state.menus, this.state[destination.droppableId] || [], source, destination, this);
                const areas = this.state.areas;
                this.updateArea(destination.droppableId, areas[destination.droppableId].tasks.concat(destClone));
                break;
            }
            default: {
                const results = move(
                    this.state.areas[source.droppableId].tasks,
                    this.state.areas[destination.droppableId].tasks,
                    source,
                    destination
                );
                this.updateArea(destination.droppableId, results[destination.droppableId]);
                this.updateArea(source.droppableId, results[source.droppableId]);
                break;
            }
        }
    };

    /**
     * 左侧可选择区域
     */
    renderSider() {
        const menus = this.state.menus;
        return (
            <Droppable droppableId='areas-menus' isDropDisabled={true}>
                {(provided, snapshot) => (
                    <Sider className='site-layout-background' width={200}>
                        <Kiosk
                            ref={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}
                            style={{ overflow: 'scroll', position: 'initial' }}
                        >
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
    }

    /**
     * 搜索区域的处理
     * 需要将其包裹在`Form`中
     * @param {*} area
     */
    renderAreaSearch(area) {
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const offsetNum = area.tasks.length % 3 === 0 ? 16 : area.tasks.length % 3 === 1 ? 8 : 0;
        return (
            <Droppable droppableId={area.id} key={area.id} className={area.className}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className={area.className}
                        style={{ border: `1px ${snapshot.isDraggingOver ? 'dashed #000' : 'dashed #ddd'}` }}
                    >
                        {area.tasks.length === 0 && <span className='title'>{area.title}</span>}
                        {area.tasks.length > 0 ? (
                            <Form {...layout} ref={this.formRef}>
                                <Row gutter={24}>
                                    {area.tasks.map((task, index) => {
                                        const result = this.getNewComponentOfAreaSearch(task, area.id);
                                        return (
                                            <Draggable draggableId={task.id} key={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Col
                                                        span={8}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            top: '0px',
                                                            // border: `1px ${snapshot.isDragging ? 'dashed #000' : 'dashed #fff1f0'}`
                                                            border:
                                                                task.id === this.state.selectedNode.node.id ? '1px dashed #ff7875' : '0px'
                                                        }}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Form.Item {...result.formItemAttrs} name={task.id}>
                                                            {result.component}
                                                        </Form.Item>
                                                    </Col>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    <Col offset={offsetNum} span={8}>
                                        <div className='br-btn-inline'>
                                            <Button onClick={() => {}}>重置</Button>
                                            <Button type='primary' onClick={() => {}}>
                                                搜索
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        ) : (
                            provided.placeholder && <Notice>Drop items here</Notice>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    }

    renderArea(area) {
        // console.log('renderArea', area);
        return (
            <Droppable droppableId={area.id} key={area.id} className={area.className}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className={area.className}
                        style={{ border: `1px ${snapshot.isDraggingOver ? 'dashed #000' : 'dashed #ddd'}` }}
                    >
                        {area.tasks.length === 0 && <span className='title'>{area.title}</span>}
                        {area.tasks.length > 0
                            ? area.tasks.map((task, index) => {
                                  const _component = this.getNewComponent(task, area.id);

                                  return (
                                      <Draggable draggableId={task.id} key={task.id} index={index}>
                                          {(provided, snapshot) => (
                                              <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  style={{
                                                      ...provided.draggableProps.style,
                                                      border: `1px ${snapshot.isDragging ? 'dashed #000' : 'dashed #fff1f0'}`
                                                  }}
                                                  {...provided.dragHandleProps}
                                              >
                                                  {_component}
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
            if (key === 'area-search') {
                nodes.push(this.renderAreaSearch(area));
            } else {
                nodes.push(this.renderArea(area));
            }
        }
        return nodes;
    }

    /**
     * 可编辑区域
     */
    renderEditContext() {
        return (
            <React.Fragment>
                <h2>Node</h2>
                <Tabs defaultActiveKey='1' onChange={() => {}}>
                    <TabPane tab='组件属性配置' key='1'>
                        <ComponentAttrsConfig
                            node={this.state.selectedNode.node}
                            updateSelectedNode={(node) => {
                                const newAreas = this.state.areas;
                                const that = this;
                                newAreas[this.state.selectedNode.area].tasks.forEach((item) => {
                                    if (item.id === node.id) {
                                        item = node;
                                        let defalutValue;
                                        node.attrs.forEach((attr) => {
                                            if (attr.key === 'default') {
                                                defalutValue = attr.value;
                                            }
                                        });
                                        debugger;
                                        that.formRef.current.setFieldsValue({ [node.id]: defalutValue });
                                    }
                                });
                                this.setState({ areas: newAreas });
                            }}
                        />
                    </TabPane>

                    <TabPane tab='表单配置' key='3'>
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </React.Fragment>
        );
    }
    render() {
        return (
            <div className='hyc-wrapper'>
                <Button className='create-code' type='primary'>
                    生成代码
                </Button>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {this.renderSider()}
                    <div className='customize-wrapper br-page'>{this.renderAreas()}</div>
                </DragDropContext>
                <div className='edit-wrapper'>{this.renderEditContext()}</div>
            </div>
        );
    }
}
