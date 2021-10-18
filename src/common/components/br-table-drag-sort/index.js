import { Table } from 'antd';
import React from 'react';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import './index.less';

const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />);
const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

/**
 * 拖拽排序Table。<br/>
 * 在场景金融中有用到。
 */
export default function BrTableDragSort({ sortTitle = '拖拽排序', columns, data = [], setData = () => {}, pagination = false }) {
    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(data), oldIndex, newIndex).filter((el) => !!el);
            setData(newData);
        }
    };
    // eslint-disable-next-line no-unused-vars
    const DraggableBodyRow = ({ className, style, ...restProps }) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = data.findIndex((x) => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };
    const DraggableContainer = (props) => <SortableContainer useDragHandle helperClass='row-dragging' onSortEnd={onSortEnd} {...props} />;
    columns.unshift({
        title: sortTitle,
        dataIndex: 'sort',
        className: 'drag-visible',
        render: () => <DragHandle />
    });
    return (
        <Table
            className='br-table-wrapper '
            pagination={pagination}
            dataSource={data}
            columns={columns}
            rowKey='index' // *必须是这个
            components={{
                body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow
                }
            }}
        />
    );
}
