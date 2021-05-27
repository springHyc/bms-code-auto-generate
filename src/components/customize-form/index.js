import React, { Component } from 'react';
import { Button, Col, message, Row, Form } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Clone, Item, Notice, Kiosk } from './style-common';
import { INIT_DATA } from './optional-component-menus';
import './index.less';
import _ from 'lodash';
import WrapperDelete from '../customize/wrapper-delete';
import { v4 as uuidv4 } from 'uuid';
import AttrEditContext from '../customize/attr-edit-context/';

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
    // if (!that.state.areas[droppableDestination.droppableId].canExistKeys.includes(item.key)) {
    //     message.error('目标区域不对，请从新选择！');
    //     return;
    // }
    const newId = uuidv4();
    destClone.splice(droppableDestination.index, 0, {
        ...item,
        id: newId
    });
    return destClone;
};
/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination, that) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    // if (!that.state.areas[droppableDestination.droppableId].canExistKeys.includes(removed.key)) {
    //     message.error('目标区域不对，请从新选择！');
    //     return;
    // }
    destClone.splice(droppableDestination.index, 0, removed);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
export default class CustomizeForm extends Component {
    state = {
        ...INIT_DATA,
        selectedNode: { node: {} },
        showCodeModalVisible: false,
        numberOfColumns: 2 // 默认列数为两列
    };

    /**
     * 右击弹出删除框
     */
    onContextMenu = (e, task) => {
        document.oncontextmenu = function () {
            return false;
        };
        const visible = this.state.visible || {};
        visible[task.id] = Object.prototype.hasOwnProperty.call(visible, task.id) ? !visible[task.id] : true;
        this.setState({ visible });
        e.stopPropagation();
    };
    /**
     * 单击选中task
     *
     * @memberof Customize
     */
    selectTask = (e, task, areaId) => {
        this.setState({
            selectedNode: { node: task, area: areaId }
        });
        e.preventDefault();
    };

    updateArea = (key, tasks) => {
        const areas = this.state.areas;
        areas[key].tasks = tasks;
        this.setState({ areas: areas });
    };
    /**
     * 关闭右击的弹框
     */
    closeContextMenu = (e, area) => {
        // 关闭所有打开的Dropdown
        const visible = this.state.visible;
        if (area.tasks.length > 0 && visible) {
            area.tasks.forEach((item) => {
                visible[item.id] = false;
            });
            this.setState({ visible });
        }
        e.preventDefault();
    };

    /**
     * 删除
     */
    deleteTask = (key, taskId) => {
        const areas = this.state.areas;
        // eslint-disable-next-line array-callback-return
        areas[key].tasks = areas[key].tasks.filter((item) => {
            if (item.id !== taskId) {
                return item;
            }
        });

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
                if (!destClone) {
                    return;
                }
                const areas = this.state.areas;
                this.updateArea(destination.droppableId, areas[destination.droppableId].tasks.concat(destClone));
                break;
            }
            default: {
                const results = move(
                    this.state.areas[source.droppableId].tasks,
                    this.state.areas[destination.droppableId].tasks,
                    source,
                    destination,
                    this
                );
                if (!results) {
                    return;
                }
                this.updateArea(destination.droppableId, results[destination.droppableId]);
                this.updateArea(source.droppableId, results[source.droppableId]);
                break;
            }
        }
    };
    /**
     * B：搜索区域：config的值应用上
     */
    getNewComponentOfAreaSearch = (task, areaId) => {
        const _component = _.cloneDeep(task.component);
        const formItemAttrs = {};
        if (task.key === 'button') {
            _component.props = {
                ..._component.props,
                children: task.attrs.name && task.attrs.name.value,
                type: task.attrs.type.value
            };
            formItemAttrs['wrapperCol'] = {
                offset: 8,
                span: 16
            };
        } else if (task && task.attrs) {
            for (const key in task.attrs) {
                const item = task.attrs[key];
                if (key === 'name' || key === 'label') {
                    formItemAttrs[key] = item.value;
                } else if (key === 'required') {
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
                        [key]: item.value
                    };
                }
            }
        }
        return { component: _component, formItemAttrs: formItemAttrs };
    };
    getNewComponent = (task, areaId) => {
        const _component = _.cloneDeep(task.component);
        return _component;
    };

    changeNumberOfColumns = (numberOfColumns) => {
        this.setState({ numberOfColumns });
    };
    /**
     * Form表单
     * 需要将其包裹在`Form`中
     * @param {*} area
     */
    renderArea(area) {
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const valueOfSpan = 24 / this.state.numberOfColumns || 2;
        return (
            <Droppable droppableId={area.id} key={area.id} className={area.className}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className={area.className}
                        style={{ border: `1px ${snapshot.isDraggingOver ? 'dashed #000' : 'dashed #ddd'}`, paddingBottom: '8px' }}
                        onClick={(e) => this.closeContextMenu(e, area)}
                    >
                        {area.tasks.length > 0 ? (
                            <Form {...layout} ref={this.formRef}>
                                <Row gutter={24}>
                                    {area.tasks.map((task, index) => {
                                        const result = this.getNewComponentOfAreaSearch(task, area.id);
                                        return (
                                            <Draggable draggableId={task.id} key={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Col
                                                        span={task.key === 'button' ? 24 : valueOfSpan}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            top: '0px',
                                                            border:
                                                                task.id === this.state.selectedNode.node.id ? '1px dashed #ff7875' : '0px'
                                                        }}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Form.Item
                                                            {...result.formItemAttrs}
                                                            name={task.id}
                                                            onClick={(e) => this.selectTask(e, task, area.id)}
                                                            onContextMenu={(e) => this.onContextMenu(e, task)}
                                                        >
                                                            <WrapperDelete
                                                                visible={(this.state.visible && this.state.visible[task.id]) || false}
                                                                deleteTask={(e) => {
                                                                    this.deleteTask(area.id, task.id);
                                                                }}
                                                            >
                                                                {result.component}
                                                            </WrapperDelete>
                                                        </Form.Item>
                                                    </Col>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                </Row>
                            </Form>
                        ) : (
                            provided.placeholder && <Notice style={{ transform: 'translateY(0)' }}>{area.title}:Drop items here</Notice>
                        )}
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
        return <div className='customize-wrapper br-form'>{nodes}</div>;
    }
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
    render() {
        return (
            <div className='customize-form-wrapper'>
                <div className='create-code'>
                    <Button onClick={() => this.changeNumberOfColumns(1)}>单列布局</Button>
                    <Button onClick={() => this.changeNumberOfColumns(2)}>两列布局</Button>
                    <Button type='primary' onClick={this.generateCode}>
                        生成代码
                    </Button>
                </div>

                {/* 拖拽区域 */}
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {this.renderSider()}
                    {this.renderAreas()}
                </DragDropContext>

                {/* 编辑Attrs属性 */}
                <AttrEditContext
                    selectedNode={this.state.selectedNode}
                    update={(data) => this.setState({ areas: data })}
                    areas={this.state.areas}
                />
            </div>
        );
    }
}
