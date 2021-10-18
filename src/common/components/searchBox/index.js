/**
 * @author  chun.he
 * @time    2020-05-11
 * @change  2020-05-26
 * @description
 *
 * 可折叠组件
 *    组件每行显示3个搜索项，默认显示2行
 *    操作按钮总是在最后一行最后一个，
 *    大于2个搜索项有重置按钮，
 *    大于2行有折叠按钮
 *
 *    ****  当组件中没有预定的输入组件类型时，可以使用自定义render 方法，也可以在组件中添加对应的输入组件  ****
 *
 *
 * 组件props
 *      option:arrary          ------> 使用一个数组描述搜索区域的搜索项， [ config={},{} ]    config 见下方
 *      onSubmit:Function      ------> 点击搜索的回调     (values)=>{ }
 *      unfoldLine:number      ------> 不折叠的行数，默认为2   【可选】
 *      fold:boolean           ------> 是否折叠，   默认true  【可选】
 *
 * ===================  config配置   ===================
 *
 * 必选项
 *      type:string            ------> 输入组件类型      === 此处可以扩展其它类型的输入组件 ===
 *      key:string             ------> 表单属性名
 *      label:string           ------> 表单标签
 *
 * 可选项
 *      init:any               ------> 默认值
 *      rules:arrary           ------> 校验规则
 *      placeholder:string     ------> 提示信息
 *      onChange:function      ------> 搜索项改变的时候调用
 *      render:<JSX | TSX>     ------> 手动生成搜索项内容，返回一个输入组件 eg:  <Input />
 *
 *
 * 特殊类型选项
 *   select
 *      options:array          -------> 搜索选项  [{ label:string, value:string|number, disabled:boolean }]
 *
 *   input
 *      maxLength:number       -------> 最大长度
 *      htmltype:string        -------> html type
 *
 *
 *   datePicker
 *      picker:string          -------> 选择日期类型  date | week | month | quarter | year
 *      format:string          -------> 日期格式化
 *
 *
 *   rangerPicker
 *      picker:string          -------> 选择日期类型   date | week | month | quarte | year
 *      format:string          -------> 日期格式化
 *      disabledDate:Function  -------> 不可选择时间   (currentDate:moment):boolean =>{}
 *
 */

import React, { Component } from 'react';
import { Select, Button, Row, Col, DatePicker, Input, Form } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

class SearchItem extends Component {
    constructor(props) {
        super(props);
    }

    renderItem() {
        const { option } = this.props;
        if (option.render && typeof option.render === 'function') {
            return option.render();
        }
        switch (option.type) {
            case 'select': {
                return (
                    <Select showSearch allowClear={true} placeholder='请选择' onChange={option.onChange}>
                        {(option.options || []).map((item, index) => {
                            return (
                                <Select.Option
                                    value={item.value}
                                    key={`key${index}`}
                                    disabled={item.disabled}
                                    placeholder={option.placeholder}
                                >
                                    {item.label}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
            }
            case 'input': {
                return (
                    <Input
                        allowClear={true}
                        placeholder={option.placeholder || ''}
                        maxLength={option.maxLength}
                        type={option.htmltype}
                        onChange={option.onChange}
                    />
                );
            }
            case 'datePicker': {
                return <DatePicker allowClear picker={option.picker} format={option.format} onChange={option.onChange} />;
            }
            case 'rangePicker': {
                return (
                    <DatePicker.RangePicker
                        allowClear
                        picker={option.picker}
                        format={option.format}
                        onChange={option.onChange}
                        disabledDate={option.disabled}
                    />
                );
            }
            default: {
                throw new Error(`未支持的元素类型: '${option.type}'， 请使用render属性自定义组件渲染或者在组建中增加新的元素类型`);
            }
        }
    }

    render() {
        const { option } = this.props;
        try {
            return (
                <Col span={8}>
                    <Form.Item name={option.key} label={option.label} rules={option.rules} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {this.renderItem()}
                    </Form.Item>
                </Col>
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export default class FoldableSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fold: this.props.fold === undefined ? true : this.props.fold, // 折叠？
            showLine: this.props.unflodLine || 2 // 默认展示行数
        };
    }

    formRef = React.createRef();

    getInitValues(option) {
        const isEmpty = (value) => [undefined, null].includes(value) || value !== value;
        const initialValues = {};
        option.forEach((item) => {
            if (!isEmpty(item.init)) {
                initialValues[item.key] = item.init;
            }
        });
        return initialValues;
    }

    render() {
        const submit = this.props.onSubmit || function () {};
        const option = this.props.option || [];

        return (
            <Form ref={this.formRef} initialValues={this.getInitValues(option)} onFinish={(value) => submit(value)}>
                <Row gutter={12}>
                    {option.length > 0 &&
                        option.map((item, index) => {
                            return this.state.fold && this.state.showLine * 3 - 1 <= index ? null : (
                                <SearchItem key={index} option={item} />
                            );
                        })}
                    <Col span={8} offset={this.state.fold ? 0 : (2 - (option.length % 3)) * 8}>
                        <div className='br-btn-inline'>
                            {option.length > 8 && (
                                <Button type='link' onClick={() => this.setState({ fold: !this.state.fold })}>
                                    {this.state.fold ? (
                                        <span>
                                            展开
                                            <DownOutlined />
                                        </span>
                                    ) : (
                                        <span>
                                            折叠
                                            <UpOutlined />
                                        </span>
                                    )}
                                </Button>
                            )}
                            {option.length > 2 && <Button onClick={() => this.formRef.current.resetFields()}>重置</Button>}
                            <Button type='primary' htmlType='submit'>
                                搜索
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    }
}
