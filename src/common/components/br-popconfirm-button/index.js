import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import _ from 'lodash';

/**
 * * 该组件作用：带二次确认框的Button按钮
 * * 参数介绍：
 * * popconfirmApi： Popconfirm组件的各种api均可以写在其中，并且会覆盖所有默认值
 * * buttonApi Button组件的各种api均可以写在其中，并且会覆盖所有默认值
 * * children：常规使用是：按钮的名称，也可以是其他组件
 * * confirmText: 确定消息，默认为:确定删除吗？
 *
 * * e.g.
 * * <BrPopconfirmButton
 * *  popconfirmApi={{
 * *      onConfirm: () => this.setOnOrOff(record.feeStatus, record.appId)
 * *  }}
 * *  confirmText={`确认将【${record.productName}】进行${
 * *      record.feeStatus == 1 ? '停用' : '启用'
 * *  }计费操作吗？`}
 * * >
 * *  {record.feeStatus == 1 ? '停用' : '启用'}计费
 * * </BrPopconfirmButton>
 */
export default class BrPopconfirmButton extends React.Component {
    render() {
        const { popconfirmApi, buttonApi, children, confirmText } = this.props;
        const title = confirmText ? confirmText : `确定${_.isString(children) ? children : '删除'}吗？`;
        return (
            <Popconfirm
                title={title}
                okText='确定'
                cancelText='取消'
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                {...popconfirmApi}
                disabled={buttonApi && Object.prototype.hasOwnProperty.call(buttonApi, 'disabled') ? buttonApi.disabled : false}
            >
                <Button type='link' {...buttonApi}>
                    {this.props.children || '删除'}
                </Button>
            </Popconfirm>
        );
    }
}
