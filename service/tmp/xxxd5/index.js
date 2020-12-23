import React, { Component } from 'react';
import { Button } from 'antd';

export default class TabDemo extends Component {
    render() {
        return (
            <div className='br-page'>
                <div className='br-operate-container'>
                    <Button type='default'>
                        按钮文本
                    </Button>
                </div>
            </div>
        );
    }
}