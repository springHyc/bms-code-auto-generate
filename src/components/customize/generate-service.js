import React from 'react';
import { Button, Col, Form, Row } from 'antd';
/**
 * 生成搜索按钮代码
 * @param {*} sourceData
 */
const generateAreaOperate = (sourceData) => {
    const btn = [];
    for (let i = 0; i < sourceData.tasks.length; i++) {
        const task = sourceData.tasks[i];
        btn.push(<Button type={task.attrs.type.value}>{task.attrs.name.value}</Button>);
    }
    if (btn.length > 0) {
        return <div className='br-operate-container'>{btn}</div>;
    } else {
        return null;
    }
};

/**
 * 生成搜素区域代码
 * @param {*} sourceData
 */
const generateAreaSearch = (sourceData) => {
    const items = [];
    for (let i = 0; i < sourceData.tasks.length; i++) {
        const task = sourceData.tasks[i];
        task.component.placeholder = task.attrs.placeholder && task.attrs.placeholder.value;
        items.push(
            <Col span={8}>
                <Form.Item
                    label={task.attrs.label && task.attrs.label.value}
                    name={task.attrs.name && task.attrs.name.value}
                    rules={[
                        {
                            required: task.attrs.required && task.attrs.required.value,
                            message: `${task.attrs.name && task.attrs.name.value}不能为空！`
                        }
                    ]}
                >
                    {task.component}
                </Form.Item>
            </Col>
        );
    }
    if (items.length > 0) {
        const offset = 2 - (items.length % 3);
        console.log('offset=', offset);
        items.push(
            <Col span={8} offset={offset}>
                <div className='br-btn-inline'>
                    <Button
                        onClick={() => {
                            // this.formRef.current.resetFields();
                        }}
                    >
                        重置
                    </Button>
                    <Button
                        type='primary'
                        onClick={() => {
                            // this.onPageChange(1);
                        }}
                    >
                        搜索
                    </Button>
                </div>
            </Col>
        );
        return (
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                // ref={this.formRef}
            >
                <Row gutter={{ xs: 8, sm: 16, md: 24 }}>{items}</Row>
            </Form>
        );
    } else {
        return null;
    }
};

const generateAreaTable = (sourceData) => {
    return sourceData.tasks && sourceData.tasks[0] && sourceData.tasks[0].component;
};

const generateCode = (sourceData) => {
    console.log('sourceData=', sourceData);
    let codeStr = (
        <div id='br-page'>
            <div className='br-page'>
                {generateAreaOperate(sourceData['area-operate'])}
                {generateAreaSearch(sourceData['area-search'])}
                {generateAreaTable(sourceData['area-table'])}
            </div>
        </div>
    );
    console.log('生成的代码=', codeStr);
    return codeStr;
};

const GenerateService = {
    generateCode
};

export default GenerateService;
