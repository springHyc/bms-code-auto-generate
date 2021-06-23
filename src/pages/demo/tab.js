import React, { Component } from 'react';
import { Tabs } from 'antd';
import 'antd/lib/tabs/style';

const TabPane = Tabs.TabPane;
export default class TabDemo extends Component {
    // 这里写内容
    render() {
        return (
            <div style={{ height: '100%', width: '100%', backgroundColor: '#fff', padding: '16px' }}>
                <Tabs defaultActiveKey='tab1' type='card' animated={true}>
                    <TabPane tab='Tab1' key='tab1'>
                        <span>Hello, world!</span>
                    </TabPane>
                    <TabPane tab='Tab2' key='tab2'>
                        <span>你好，世界！</span>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
