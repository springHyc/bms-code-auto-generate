import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import { Tooltip, message } from 'antd';
import './index.less';

/**
 * 通常在Table组件中使用，也可以单独使用，当内容文字过长是，展示...并隐藏多余文字，鼠标滑动，展示全部的文字
 * 文字截断长度是200px
 * @param {*} value  该列展示的内容
 * @param {*} copy  该列内容是否可复制
 *
 */
export default function BrTableColumnLong({ ...args }) {
    return <BrLongWords {...args} />;
}
/**
 * 当内容文字过长是，展示...并隐藏多余文字，鼠标滑动，展示全部的文字；<br/>
 * 文字截断长度是200px;<br/>
 * 设置`copy=true`则可以将文字进行复制。<br/>
 *
 * * @param {string} value  展示的内容<br/>
 * * @param {boolean} copy  该内容是否可复制<br/>
 * * @param {number} width 截断文字的长度，默认为200px<br/>
 *
 */
export function BrLongWords({ value, copy = false, width = 200 }) {
    return (
        <Tooltip title={value} placement='topLeft'>
            <div className='br-table-column-content-too-long-wrapper'>
                <span className='content-long' style={{ width: `${width}px` }}>
                    {value}
                </span>
                {copy && (
                    <CopyToClipboard text={value} onCopy={() => message.info('复制成功', 1)}>
                        <CopyOutlined id='copy' style={{ color: '#03A9F4' }} />
                    </CopyToClipboard>
                )}
            </div>
        </Tooltip>
    );
}
