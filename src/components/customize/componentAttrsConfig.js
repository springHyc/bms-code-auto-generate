import React from 'react';
import { Form, Input, Radio, Select, Checkbox } from 'antd';

/**
 * 组件通用配置
 * @param {*} param0
 */
export default function ComponentAttrsConfig({ node, updateSelectedNode }) {
    let formRef = React.createRef();
    const attrs = (node && node.attrs) || [];
    // 修改Node属性值
    const onChange = (value, id) => {
        attrs.forEach((attr) => {
            if (attr.id === id) {
                attr.value = value;
            }
        });
        updateSelectedNode(node);
    };
    const formItemProps = (attr) => {
        return {
            label: attr.name,
            key: attr.id,
            rules: [{ required: attr.required, message: `${attr.name}不能为空！` }]
        };
    };
    return (
        <div>
            <Form ref={formRef}>
                {attrs.map((attr) => {
                    if (attr.type === 'string') {
                        return (
                            <Form.Item {...formItemProps(attr)}>
                                <Input onChange={(e) => onChange(e.target.value, attr.id)} value={attr.value} />
                            </Form.Item>
                        );
                    } else if (attr.type === 'radio') {
                        return (
                            <Form.Item {...formItemProps(attr)}>
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
                            <Form.Item {...formItemProps(attr)}>
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
                            <Form.Item {...formItemProps(attr)}>
                                <Checkbox onChange={({ target }) => onChange(target.checked, attr.id)}>是否必填</Checkbox>
                            </Form.Item>
                        );
                    } else if (attr.type === 'function') {
                        return (
                            <Form.Item {...formItemProps(attr)}>
                                <Input.TextArea value={attr.value} rows={3} onChange={({ target }) => onChange(target.value, attr.id)} />
                            </Form.Item>
                        );
                    }
                    return null;
                })}
            </Form>
        </div>
    );
}
