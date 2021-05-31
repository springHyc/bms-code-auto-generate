import React from 'react';
import Sider from 'antd/lib/layout/Sider';
import { message, Form, Row, Col, Button } from 'antd';
import { INIT_DATA } from './optional-component-menus';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './index.less';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Item, Notice, Kiosk } from './style-common';
import GenerateService from './generate-service';
import ShowCodeModal from './showCodeModal';
import WrapperDelete from './wrapper-delete';
import Utils from './utils';
import AttrEditContext from './attr-edit-context/';

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
    if (!that.state.areas[droppableDestination.droppableId].canExistKeys.includes(item.key)) {
        message.error('目标区域不对，请从新选择！');
        return;
    }
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
    if (!that.state.areas[droppableDestination.droppableId].canExistKeys.includes(removed.key)) {
        message.error('目标区域不对，请从新选择！');
        return;
    }
    destClone.splice(droppableDestination.index, 0, removed);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
export default class Customize extends React.Component {
    state = { ...INIT_DATA, selectedNode: { node: {} }, showCodeModalVisible: false };
    formRef = React.createRef();
    source = '';

    getNewComponent = (task, areaId) => {
        if (areaId === 'area-operate') {
            return this.getNewComponentOfAreaOperate(task);
        } else {
            return this.getNewComponentOfAreaTable(task);
        }
    };
    /**
     * A：按钮区域：config的值应用上
     * 展示的时候，从新渲染组件，得专门的组件来专门做
     */
    getNewComponentOfAreaOperate = (task, areaId) => {
        const _component = _.cloneDeep(task.component);
        if (task.key === 'button') {
            _component.props = {
                ..._component.props,
                children: task.attrs.name && task.attrs.name.value,
                type: task.attrs.type.value
            };
        }

        return _component;
    };

    /**
     * B：搜索区域：config的值应用上
     */
    getNewComponentOfAreaSearch = (task, areaId) => {
        const _component = _.cloneDeep(task.component);
        const formItemAttrs = {};
        if (areaId === 'area-search') {
            if (task && task.attrs) {
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
        }
        return { component: _component, formItemAttrs: formItemAttrs };
    };

    /**
     * C：Table区域：config的值应用上
     */
    getNewComponentOfAreaTable = (task) => {
        const _component = _.cloneDeep(task.component);
        // * 容错处理
        if (task.key !== 'table') {
            return _component;
        } else {
            _component.props = {
                ..._component.props,
                columns: Utils.getColumns(task.attrs),
                dataSource: Utils.randomData(task.attrs.columns)
            };
            return _component;
        }
    };

    updateArea = (key, tasks) => {
        const areas = this.state.areas;
        areas[key].tasks = tasks;
        this.setState({ areas: areas });
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
                const destClone = copy(this.state.menus, this.state.areas[destination.droppableId].tasks || [], source, destination, this);
                if (!destClone) {
                    return;
                }
                this.updateArea(destination.droppableId, destClone);
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
     * 生成代码
     */
    generateCode = () => {
        const service = new GenerateService(this.state.areas);
        // ----table的辅助操作----
        const tableConfigData = (this.state.areas['area-table'].tasks && this.state.areas['area-table'].tasks[0]) || {};
        if (Object.prototype.hasOwnProperty.call(tableConfigData, 'attrs') && Object.keys(tableConfigData.attrs).length > 0) {
            // 处理table的辅助操作
            service.generateAssistTable(tableConfigData.attrs);
        }
        // ----table的辅助操作----
        this.indexCodeStr = service.indexCodeStr;
        this.columnsCodeStr = service.columnsCodeStr;

        // 有操作列的Table
        // console.log('this.columnsCodeStr=', this.columnsCodeStr);
        this.setState({ showCodeModalVisible: true });
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
     * 左侧可选择区域
     */
    renderSider() {
        const menus = this.state.menus;
        return (
            <Droppable droppableId='areas-menus' isDropDisabled={true}>
                {(provided, snapshot) => (
                    <Sider width={200}>
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
                                                {snapshot.isDragging && <Item>{menu.name}</Item>}
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
            <Droppable droppableId={area.id} key={area.id} className={area.className} direction='horizontal'>
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
                                                        span={8}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        style={
                                                            !snapshot.isDragging
                                                                ? {
                                                                      ...provided.draggableProps.style,
                                                                      top: '0px',
                                                                      border:
                                                                          task.id === this.state.selectedNode.node.id
                                                                              ? '1px dashed #ff7875'
                                                                              : 'none'
                                                                  }
                                                                : {
                                                                      ...provided.draggableProps.style,
                                                                      border: '1px dashed #000',
                                                                      position: 'relative',
                                                                      top: '0px',
                                                                      left: '0px',
                                                                      right: '0px'
                                                                  }
                                                        }
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
                                                                deleteTask={(e) => this.deleteTask(area.id, task.id)}
                                                            >
                                                                {result.component}
                                                            </WrapperDelete>
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
                            provided.placeholder && <Notice style={{ transform: 'translateY(0)' }}>{area.title}:Drop items here</Notice>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    }

    renderArea(area) {
        return (
            <Droppable droppableId={area.id} key={area.id} className={area.className} direction='horizontal'>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className={area.className}
                        style={{ border: `1px ${snapshot.isDraggingOver ? 'dashed #000' : 'dashed #ddd'}` }}
                        onClick={(e) => this.closeContextMenu(e, area)}
                    >
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
                                                  // 添加点击事件
                                                  onClick={(e) => this.selectTask(e, task, area.id)}
                                                  // 右击事件
                                                  onContextMenu={(e) => this.onContextMenu(e, task)}
                                              >
                                                  <WrapperDelete
                                                      visible={(this.state.visible && this.state.visible[task.id]) || false}
                                                      deleteTask={(e) => {
                                                          this.deleteTask(area.id, task.id);
                                                      }}
                                                  >
                                                      {_component}
                                                  </WrapperDelete>
                                              </div>
                                          )}
                                      </Draggable>
                                  );
                              })
                            : provided.placeholder && (
                                  <Notice style={(area.id === 'area-table' && { marginTop: '130px' }) || {}}>
                                      {area.title}:Drop items here
                                  </Notice>
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
            if (key === 'area-search') {
                nodes.push(this.renderAreaSearch(area));
            } else {
                nodes.push(this.renderArea(area));
            }
        }
        return <div className='customize-wrapper br-page'>{nodes}</div>;
    }

    render() {
        return (
            <div className='hyc-wrapper'>
                <Button className='create-code' type='primary' onClick={this.generateCode}>
                    生成代码
                </Button>
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
                {/* 展示自动生成的code */}
                <ShowCodeModal
                    visible={this.state.showCodeModalVisible}
                    close={() => this.setState({ showCodeModalVisible: false })}
                    indexCodeStr={this.indexCodeStr}
                    columnsCodeStr={this.columnsCodeStr}
                    tableConfigData={this.state.areas && this.state.areas['area-table']}
                />
            </div>
        );
    }
}
