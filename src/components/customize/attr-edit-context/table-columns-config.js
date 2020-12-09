import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default function TableColumnsConfig({ node, updateSelectedNode }) {
    const attrs = (node && node.attrs) || [];
    // 修改Node属性值
    const onFinish = (values) => {
        console.log('Received values of form:', values);
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                attrs[key] = values[key];
            }
        }
        updateSelectedNode(node);
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 }
        }
    };
    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 18, offset: 6 }
        }
    };

    return (
        <Form name='dynamic_form_nest_item' onFinish={onFinish} autoComplete='off' className='table-columns-config' initialValues={attrs}>
            <Form.List name='operate'>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, index) => (
                            <Form.Item
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                label={index === 0 ? '操作列' : ''}
                                required={false}
                                key={field.key}
                                style={{ display: 'flex' }}
                            >
                                <Space key={field.key} style={{ display: 'flex' }} align='baseline'>
                                    <Form.Item {...field} name={[field.name, 'name']} fieldKey={[field.fieldKey, 'name']} noStyle>
                                        <Input placeholder='按钮名称' />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Space>
                            </Form.Item>
                        ))}
                        <Form.Item>
                            <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                                添加操作列
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.List name='columns'>
                {(fields, { add, remove, move }) => {
                    return (
                        <>
                            {fields.map((field) => (
                                <Space key={field.key} style={{ display: 'flex', alignItems: 'center' }} align='baseline'>
                                    <Space style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Form.Item
                                            {...field}
                                            label='title'
                                            labelCol={{ span: 10 }}
                                            name={[field.name, 'title']}
                                            fieldKey={[field.fieldKey, 'title']}
                                            rules={[{ required: true, message: '不能为空' }]}
                                        >
                                            <Input placeholder='title' />
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            label='dataIndex'
                                            labelCol={{ span: 10 }}
                                            name={[field.name, 'dataIndex']}
                                            fieldKey={[field.fieldKey, 'dataIndex']}
                                            rules={[{ required: true, message: '不能为空' }]}
                                        >
                                            <Input placeholder='dataIndex' />
                                        </Form.Item>
                                    </Space>
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                                    添加列
                                </Button>
                                {/* move功能先不加，以后想好再加 */}
                                {/* <Button type='dashed' onClick={() => move(0, 1)} block icon={<PlusOutlined />}>
                                    Move
                                </Button> */}
                            </Form.Item>
                        </>
                    );
                }}
            </Form.List>
            <Form.Item>
                <Button type='primary' htmlType='submit'>
                    保存
                </Button>
            </Form.Item>
        </Form>
    );
}
