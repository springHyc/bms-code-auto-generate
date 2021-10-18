// 普通列表组件，具备通用性，可在其他项目中使用
import React, { Component } from 'react';
import { Table, message } from 'antd';
import './index.less';
import BrTableColumnLong from '../br-table-column-long';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import lodash from 'lodash';

const pageSizeOptions = ['10', '20', '50', '100'];
const defalutPageSize = 10;
const defaultPageNum = 1;
const isEmpty = (value) => {
    if (lodash.isNumber(value)) {
        return !lodash.isNumber(value);
    } else {
        return lodash.isEmpty(value);
    }
};
/**
 * 该组件是antd中Table组件的封装。
 * antd中table的所有属性都可以传进该组件中。
 * ...rest属性为没有列举的table的属性
 * BrTable组件涵盖了自动获取table数据，以及添加了loading状态，不过loading状态需要外部提供与更新。<br/>
 *
 * * 下面提到的参数是必填的。<br/>
 * ===============Column的参数==================<br/>
 * * Column.propTypes = {<br/>
 *  * &nbsp;&nbsp;  title: PropTypes.string.isRequired, 列名称<br/>
 *    * &nbsp;&nbsp;&nbsp;&nbsp; 当title想要有文字解释时，使用`title: <BrTableColumnTitleTip title='该列内容很长但是要看全' tipTitle='具体使用方法看code' />`即可。<br/>
 *  * &nbsp;&nbsp;  dataIndex: PropTypes.string.isRequired, <br/>
 *  * &nbsp;&nbsp;  tooLong: PropTypes.bool, 列表中某一列过程时，展示200px的，多余的展示...,并鼠标滑过时展示全部<br/>
 *  * &nbsp;&nbsp;  copy: PropTypes.bool 该列可复制（需要没有重写render方法）<br/>
 *  * &nbsp;&nbsp;  valueType: PropTypes.string 如果 column.valueType == 'digit' 则按照英文数字方式（每隔3位加逗号）展示;<br/>
 *  * &nbsp;&nbsp;  className: 'br-numberAlign': 表示该列数字右对齐，如果需要截取固定位数的小数，需要自己在render中实现；<br/>
 *    * 暂时valueType=='digit'和className: 'br-numberAlign'不能同时使用<br/>
 *  * &nbsp;&nbsp;  className: 'br-statusCompare'： 表示列状态对比，需要配合ready、unknown、developing、creating、launched、disabled等className来使用；<br/>
 *    * 配合render方法这样来做：`render: value => <span className='unknown'>value</span>`<br/>
 *
 * };<br/>
 * * 默认情况下，没有重写render()方法时，当该列没有值时，我们会自动展示”-“<br/>
 *
 */
export default class BrTable extends Component {
    pageInfo = { pageSize: defalutPageSize, pageNum: defaultPageNum };

    componentDidMount() {
        this.fetchList();
    }

    onPageChange = (pageNumber) => {
        this.pageInfo.pageNum = pageNumber;
        this.fetchList();
    };
    onShowSizeChange = (current, pageSize) => {
        this.pageInfo = { pageNum: current, pageSize: pageSize };
        this.fetchList();
    };

    fetchList = () => {
        const { updateLoading, fetchListFn } = this.props;
        updateLoading(true);
        fetchListFn(this.pageInfo).then(() => {
            updateLoading(false);
        });
    };
    render() {
        const { columns, dataSource, total, scroll, rowKey, ...rest } = this.props;
        const scrollConfig = {
            scrollToFirstRowOnChange: true
        };
        if (scroll) {
            scrollConfig.x = true;
            scrollConfig.y = true;
        }
        columns.map((column) => {
            if (column.tooLong) {
                if (!column.render) {
                    if (column.copy) {
                        column.render = (value) => <BrTableColumnLong value={value} copy={true} />;
                    } else {
                        column.render = (value) => <BrTableColumnLong value={value} />;
                    }
                }
            } else if (column.copy) {
                if (!column.render) {
                    // 只有当该列没有自己写`render`方法时，并且该列有copy属性时，才会展示复制的图标
                    column.render = (value) => (
                        <React.Fragment>
                            {value}
                            <CopyToClipboard text={value} onCopy={() => message.info('复制成功', 1)}>
                                <CopyOutlined id='copy' style={{ color: '#03A9F4' }} />
                            </CopyToClipboard>
                        </React.Fragment>
                    );
                }
            } else if (column.valueType) {
                // 处理valueType，以后可能有更多的值
                if (column.valueType === 'digit') {
                    // 则按照英文数字方式（每隔3位加逗号）展示;
                    column.render = (value) => new Intl.NumberFormat().format(Number(value));
                }
            }
            if (!column.render) {
                column.render = (value) => (isEmpty(value) ? '-' : value);
            }
        });
        return (
            <Table
                rowKey={(row) => rowKey || row.id || row.key}
                columns={columns}
                dataSource={dataSource}
                locale={{ emptyText: '暂无数据' }}
                className='br-table-wrapper'
                pagination={{
                    showSizeChanger: true,
                    current: this.pageInfo.pageNum,
                    pageSize: this.pageInfo.pageSize,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onShowSizeChange,
                    total: Number(total),
                    pageSizeOptions: pageSizeOptions,
                    showQuickJumper: true,
                    showTotal(total) {
                        return `共 ${total} 条`;
                    }
                }}
                {...rest}
                scroll={scrollConfig} // 当切换页码时，要回到table的top,要写上
            />
        );
    }
}
