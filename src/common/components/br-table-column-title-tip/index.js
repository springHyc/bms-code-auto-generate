import React from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

/**
 * 结合Table组件中使用，对列表头进行解释说明
 * title：表头名
 * tipTitle： 对表头的解释说明文字
 *
 * @export
 * @param {*} { title, tipTitle }
 * @returns
 */
export default function BrTableColumnTitleTip({ title, tipTitle }) {
    return (
        <span>
            {title}
            <Tooltip title={tipTitle}>
                <QuestionCircleOutlined style={{ marginLeft: '4px', color: '#888' }} />
            </Tooltip>
        </span>
    );
}
