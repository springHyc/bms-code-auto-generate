// 普通列表组件，具备通用性，可在其他项目中使用

import React, { Component } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Table, Button, Tree, Popover } from 'antd';
const { TreeNode } = Tree;

/**
 * 可以全部表头字段可选，也可以部分表头字段可选,可选内容还可以进行自定义拖动排序，分组的形式不知道自定义拖动
 *   备注：排序只是一次性的，不会永久保存。
 * 传递的参数：
 * columns：正常的表头信息，里面会添加列可配置的信息
 *   eg:[
 *         { // * 正常的表头信息
 *              title: '账单月',
 *              dataIndex: 'month',
 *              fixed: 'left'
 *          },
 *          {
 *               title: '起始日期',
 *               dataIndex: 'begin',
 *               render: value => value || '-',
 *               // customize:表示该列表是可设置的列
 *               customize: {
 *                   show: true, // * 可设置的该列是否默认展示：可取值true/false,是否展示；
 *                               // * 默认为false,不展示。
 *                   parent: 'A',// * 属于哪个分组，默认没有分组，也不用写这个属性值
 *               },
 *           },
 *      ]
 * ---------------------------------
 * dataSource： 列表展示内容
 * pagination： 分页信息，包括分页的点击函数，都在使用的地方定义好
 * columnSettingButton: 列设置按钮的展示位置：默认为:false在操作列右侧展示，true时，在上方以按钮的形式展示。如果没有操作列时，则columnSettingButton必须为true,否则不展示
 * scroll： table是否滚动，默认不写是`{ x: true, y: true, scrollToFirstRowOnChange: true}`
 * columnSettingGroup：可设置列进行分组，不写的话，不进行分组
 *   eg: [
 *           { id: 'A', title: 'A分组' },
 *           { id: 'B', title: 'B分组' },
 *           { id: 'C', title: 'C分组' }
 *       ]
 *    id: 分组的id。和`customize.parent`对应。如果`columns`中的某一列中的`customize.parent`
 *        的值和columnSettingGroup中的某一个id对应，则是该分组中的列
 *    title: 分组的名称
 * loading：对应Table组件的属性
 */
export default class BrCustomizeColumnTable extends Component {
    constructor(props) {
        super(props);
        const sortedColumns = this.sortColumns(props.columns);
        this.state = {
            plainOptions: sortedColumns.plainOptions, //默认的字段列表
            checkedOptions: sortedColumns.checkedOptions, //默认的已选择字段
            editPlainOptions: sortedColumns.plainOptions, //当前选择的字段列表，未保存
            editCheckedOptions: sortedColumns.checkedOptions, //当前已选择字段，未保存
            isClickHandleSearch: '', //设置字段后在未保存的情况下点击空白区域字段重置
            customizeColumns: sortedColumns.customizeColumns, // 可定制列的集合
            popoverVisible: false // 列设置按钮在列表上方展示时所用
        };
    }

    // 当columns改变时也跟着改变。
    UNSAFE_componentWillReceiveProps(nexrProps) {
        if (nexrProps.columns && this.props.columns && nexrProps.columns.length != this.props.columns.length) {
            const sortedColumns = this.sortColumns(nexrProps.columns);
            this.setState({
                plainOptions: sortedColumns.plainOptions, //默认的字段列表
                checkedOptions: sortedColumns.checkedOptions, //默认的已选择字段
                editPlainOptions: sortedColumns.plainOptions, //当前选择的字段列表，未保存
                editCheckedOptions: sortedColumns.checkedOptions, //当前已选择字段，未保存
                customizeColumns: sortedColumns.customizeColumns // 可定制列的集合
            });
        }
    }

    /**
     * 区分各个列
     * normalColumns： 普通的列，不需要进行设置的列
     * customizeColumns： 需要进行定制的列
     * checkedOptions： 需要定制的列中，默认展示的列
     * @memberof CustomizeColumnTable
     */
    sortColumns = (columns) => {
        const customizeColumns = [],
            checkedOptions = [],
            plainOptions = [];
        columns.forEach((column) => {
            if (column.customize) {
                // 需要定制的列
                customizeColumns.push({ ...column, key: column.dataIndex });
                if (column.customize.show) {
                    checkedOptions.push(column.dataIndex);
                }
            }
            plainOptions.push({ ...column, key: column.dataIndex });
        });

        return {
            customizeColumns,
            checkedOptions,
            plainOptions
        };
    };

    onFilterDropdownVisibleChange = (visible) => {
        if (visible && !this.state.isClickHandleSearch) {
            this.setState({
                isClickHandleSearch: false
            });
        } else {
            this.setState({
                plainOptions: this.state.editPlainOptions,
                checkedOptions: this.state.editCheckedOptions
            });
        }
    };
    handleSearch = (confirm) => {
        //确定 保存用户设置的字段排序和需要显示的字段key
        const { plainOptions, checkedOptions } = this.state;
        this.setState(
            {
                isClickHandleSearch: true,
                editPlainOptions: plainOptions,
                editCheckedOptions: checkedOptions
            },
            () => {
                confirm();
            }
        );
    };

    handleReset = (clearFilters) => {
        //用户点击取消按钮，重置字段
        clearFilters();
        this.setState({
            plainOptions: this.state.editPlainOptions,
            checkedOptions: this.state.editCheckedOptions
        });
    };

    onCheck = (checkedKeys) => {
        this.setState({
            checkedOptions: checkedKeys
        });
    };

    /**
     * 可移动Tree组件中的项
     *
     * @memberof CustomizeColumnTable
     */
    onDrop = (info) => {
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        if (dropPosition === 1 || dropPosition == -1) {
            const loop = (data, key, callback) => {
                data.forEach((item, index, arr) => {
                    if (item.key === key) {
                        return callback(item, index, arr);
                    }
                    if (item.children) {
                        return loop(item.children, key, callback);
                    }
                });
            };
            const data = [...this.state.plainOptions];
            let dragObj;
            loop(data, dragKey, (item, index, arr) => {
                arr.splice(index, 1);
                dragObj = item;
            });
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
            // 从新提取customizeColumns的数据
            let _customizeColumns = [];
            data.forEach((column) => {
                // eslint-disable-next-line no-empty
                if (!column.customize) {
                } else {
                    _customizeColumns.push(column);
                }
            });
            // 从新提取customizeColumns的数据
            this.setState({
                plainOptions: data,
                customizeColumns: _customizeColumns
            });
        }
    };
    getTreecontent = (confirm, onCancel, isDrop) => {
        const { checkedOptions, customizeColumns } = this.state;
        return (
            <div style={{ padding: 8 }}>
                <Tree
                    checkable
                    className='draggable-tree'
                    draggable
                    blockNode
                    selectable={false}
                    onCheck={this.onCheck.bind(this)}
                    checkedKeys={checkedOptions}
                    onDrop={(isDrop && this.onDrop) || null} // 分组的形式暂时不支持
                >
                    {this.loop(customizeColumns)}
                </Tree>
                <div>
                    <Button type='primary' size='small' onClick={() => confirm()} style={{ width: '60px', marginRight: '10px' }}>
                        确定
                    </Button>
                    <Button size='small' onClick={onCancel} style={{ width: '60px' }}>
                        取消
                    </Button>
                </div>
            </div>
        );
    };

    loop = (data) => {
        const { columnSettingGroup } = this.props;
        if (!columnSettingGroup) {
            // 没有分组时
            return data.map((item) => <TreeNode key={item.key} title={item.title} />);
        } else {
            // 有分组时
            return columnSettingGroup.map((item) => (
                <TreeNode title={item.title} key={item.id}>
                    {data.map((column) => {
                        if (column.customize && column.customize.parent == item.id) {
                            return <TreeNode key={column.key} title={column.title} />;
                        }
                    })}
                </TreeNode>
            ));
        }
    };
    render() {
        const { checkedOptions, plainOptions } = this.state;
        const { dataSource, pagination, scroll, columnSettingButton, loading } = this.props;

        let newColumnList = [];
        // 默认在操作列展示可设置的按钮
        newColumnList = plainOptions.map((column) => {
            // 在操作列右上角添加设置表头的按钮
            if (column.dataIndex == 'operate' && !columnSettingButton) {
                column.filterIcon = () => <MoreOutlined style={{ color: '#FF7D52', fontSize: '20px' }} />;
                column.onFilterDropdownVisibleChange = this.onFilterDropdownVisibleChange;
                column.filterDropdown = ({ confirm, clearFilters }) =>
                    this.getTreecontent(
                        () => this.handleSearch(confirm),
                        () => {
                            this.handleReset(clearFilters);
                        },
                        true
                    );
            }
            if (!column.customize) {
                // 不需要定制的列
                return { ...column, key: column.dataIndex };
            } else {
                return { ...column, key: column.dataIndex, filterType: checkedOptions.some((item) => item === column.dataIndex) };
            }
        });
        const _new = newColumnList.filter((item) => item.filterType || item.filterType === undefined);
        // 为了避免列数过少时，造成的断层，先暂时这样处理
        if (_new.length <= 15) {
            _new.map((item) => {
                if (Object.prototype.hasOwnProperty.call(item, 'fixed')) {
                    item.fixed1 = item.fixed;
                    delete item.fixed;
                }
                return item;
            });
        } else {
            _new.map((item) => {
                if (Object.prototype.hasOwnProperty.call(item, 'fixed1')) {
                    item.fixed = item.fixed1;
                }
                return item;
            });
        }
        return (
            <div>
                {columnSettingButton && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Popover
                            content={this.getTreecontent(
                                () => this.setState({ popoverVisible: false }),
                                () => {
                                    this.handleReset(() => this.setState({ popoverVisible: false }));
                                },
                                false
                            )}
                            trigger='click'
                            placement='bottomLeft'
                            visible={this.state.popoverVisible}
                            onVisibleChange={(visible) => this.setState({ popoverVisible: visible })}
                        >
                            <Button
                                icon={<MoreOutlined />}
                                size='large'
                                style={{
                                    alignSelf: 'flex-end',
                                    margin: '16px',
                                    backgroundColor: '#FF7D52',
                                    borderColor: '#FF7D52',
                                    color: '#fff'
                                }}
                            >
                                列设置
                            </Button>
                        </Popover>
                    </div>
                )}

                <Table
                    rowKey={(row) => row.id || row.key}
                    columns={_new}
                    dataSource={dataSource}
                    locale={{ emptyText: '暂无数据' }}
                    className='br-table-wrapper'
                    pagination={pagination}
                    scroll={scroll || { x: true, y: true, scrollToFirstRowOnChange: true }}
                    loading={loading}
                />
            </div>
        );
    }
}
