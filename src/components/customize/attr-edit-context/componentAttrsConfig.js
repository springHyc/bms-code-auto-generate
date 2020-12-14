import React from 'react';
import { Form, Input, Radio, Select, Checkbox, Space, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

/**
 * 右侧区域
 * 组件通用配置
 * @param {*} param0
 */
export default function ComponentAttrsConfig({ node, updateSelectedNode }) {
    let formRef = React.createRef();
    const attrs = (node && node.attrs) || [];

    // 修改Node属性值
    const onChange = (value, id) => {
        for (const key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                const attr = attrs[key];
                if (attr.id === id) {
                    attr.value = value;
                }
            }
        }
        updateSelectedNode(node);
    };
    const formItemProps = (key, attr) => {
        return {
            label: attr.text,
            key: attr.id,
            rules: [{ required: attr.required, message: `${key}不能为空！` }]
        };
    };

    const onFinish = (values) => {
        const [key, id] = Object.keys(values)[0].split('/');
        const options = [];
        values[`${key}/${id}`].forEach((item) => {
            options.push(item);
        });
        onChange(options, id);
    };
    const keys = Object.keys(attrs);
    return (
        <div>
            <Form ref={formRef} onFinish={onFinish}>
                {keys.map((key) => {
                    const attr = attrs[key];
                    if (attr.type === 'string') {
                        return (
                            <Form.Item {...formItemProps(key, attr)}>
                                <Input onChange={(e) => onChange(e.target.value, attr.id)} value={attr.value} />
                            </Form.Item>
                        );
                    } else if (attr.type === 'radio') {
                        return (
                            <Form.Item {...formItemProps(key, attr)}>
                                <Radio.Group>
                                    {attr.options.map((option) => (
                                        <Radio key={option} value={option}>
                                            {option}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>
                        );
                    } else if (attr.type === 'select') {
                        return (
                            <Form.Item {...formItemProps(key, attr)}>
                                <Select value={attr.value} onChange={(value) => onChange(value, attr.id)}>
                                    {attr.options.map((option) => (
                                        <Select.Option key={option} value={option}>
                                            {option}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        );
                    } else if (attr.type === 'checkbox') {
                        return (
                            <Form.Item {...formItemProps(key, attr)}>
                                <Checkbox onChange={({ target }) => onChange(target.checked, attr.id)}>是否必填</Checkbox>
                            </Form.Item>
                        );
                    } else if (attr.type === 'function') {
                        return (
                            <Form.Item {...formItemProps(key, attr)}>
                                <Input.TextArea value={attr.value} rows={3} onChange={({ target }) => onChange(target.value, attr.id)} />
                            </Form.Item>
                        );
                    } else if (attr.type === 'option') {
                        // 添加options
                        return (
                            <Form.List name={`options/${attr.id}`} {...formItemProps(key, attr)}>
                                {(fields, { add, remove }) => {
                                    return (
                                        <>
                                            {fields.map((field, idx) => (
                                                <Space key={field.key} style={{ display: 'flex', alignItems: 'center' }} align='baseline'>
                                                    <Space style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <Form.Item
                                                            {...field}
                                                            label='key'
                                                            labelCol={{ span: 10 }}
                                                            name={[field.name, 'key']}
                                                            fieldKey={[field.fieldKey, 'key']}
                                                            rules={[{ required: true, message: '不能为空' }]}
                                                        >
                                                            <Input placeholder='key' />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...field}
                                                            label='value'
                                                            labelCol={{ span: 10 }}
                                                            name={[field.name, 'value']}
                                                            fieldKey={[field.fieldKey, 'value']}
                                                            rules={[{ required: true, message: '不能为空' }]}
                                                        >
                                                            <Input placeholder='value' />
                                                        </Form.Item>
                                                    </Space>
                                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                                                    添加Options
                                                </Button>
                                                {fields && fields.length > 0 && (
                                                    <Button type='primary' block htmlType='submit' style={{ marginTop: 8 }}>
                                                        保存
                                                    </Button>
                                                )}
                                            </Form.Item>
                                        </>
                                    );
                                }}
                            </Form.List>
                        );
                    }
                    return null;
                })}
            </Form>
        </div>
    );
}
