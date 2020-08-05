import React from 'react';
import { Form, Input, Radio, Select } from 'antd';

/**
 * 组件通用配置
 * @param {*} param0
 */
export default function ComponentAttrsConfig({ node, updateSelectedNode }) {
    console.log('selected node =', node);
    const attrs = (node && node.attrs) || [];
    const onChange = (value, id) => {
        attrs.forEach((attr) => {
            if (attr.id === id) {
                attr.value = value;
            }
        });
        updateSelectedNode(node);
    };
    return (
        <div>
            <Form>
                {attrs.map((attr) => {
                    if (attr.type === 'string') {
                        return (
                            <Form.Item
                                label={attr.name}
                                key={attr.id}
                                rules={[{ required: attr.required, message: `${attr.name}不能为空！` }]}
                            >
                                <Input onChange={(e) => onChange(e.target.value, attr.id)} value={attr.value} />
                            </Form.Item>
                        );
                    } else if (attr.type === 'radio') {
                        return (
                            <Form.Item
                                label={attr.name}
                                key={attr.id}
                                rules={[{ required: attr.required, message: `${attr.name}不能为空！` }]}
                            >
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
                            <Form.Item
                                label={attr.name}
                                key={attr.id}
                                rules={[{ required: attr.required, message: `${attr.name}不能为空！` }]}
                            >
                                <Select value={attr.value} onChange={(value) => onChange(value, attr.id)}>
                                    {attr.options.map((option) => (
                                        <Select.Option key={option} value={option}>
                                            {option}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        );
                    } else if (attr.type === 'function') {
                        return (
                            <Form.Item
                                label={attr.name}
                                key={attr.id}
                                rules={[{ required: attr.required, message: `${attr.name}不能为空！` }]}
                            >
                                <Input.TextArea value={attr.value} rows={3} onChange={({ target }) => onChange(target.value, attr.id)} />
                            </Form.Item>
                        );
                    }
                    return null;
                })}
                {/* <Form.Item label='field: 字段名' name='fieldName' rules={[{ required: true, message: '请输入姓名！' }]}>
                    <Input />
                </Form.Item> */}
                {/* todo 搜索区域的默认值可以直接这样写，但是如果是「编辑」按钮的Modal弹框中默认值就不能这样写，涉及到数据绑定 */}
                {/* <Form.Item label='default: 默认值'>
                    <Input />
                </Form.Item>
                <Form.Item label='required: 校验'>
                    <Checkbox>是否必填</Checkbox>
                </Form.Item> */}
                {/* todo 校验规则的文档查看链接 */}
                {/* <Form.Item label='rules: 校验规则'>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label='tip: 表单提示项'>
                    <Input />
                </Form.Item> */}
            </Form>
        </div>
    );
}
