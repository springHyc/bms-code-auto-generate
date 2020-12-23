import React, { Component } from 'react';
import { Typography } from 'antd';
const { Title } = Typography;

export default class CustomizeForm extends Component {
    render() {
        return (
            <Title type='warning' level={2}>
                拖拽生成自定义Form表单功能敬请期待！
            </Title>
        );
    }
}
