import React, { useState } from 'react';
import { Checkbox, Row, Col } from 'antd';
import './index.less';
/**
 * @param {number} columns 采用Grid布局的方式进行展示，默认为3
 * @param {array} data 多选要展示的数据，数组的组成为`{id,name}`方式，默认为[]
 * @param {function} changeItem 点击单个选项时触发的事件，回传的参数是checkedList
 * @param {function} checkallChange 点击「全选」按钮后触发的事件，回传的参数是checkedList
 * @param {array} echoData 用于回显的已选中的数据的id的集合,默认为[]
 * @param {*} param0
 * @returns 带全选按钮的多选组件
 */
export default function BrCheckboxAll({ columns = 3, data = [], changeItem, checkallChange, echoData }) {
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [prevEchoData, setPrevEchoData] = useState({});
    // 实现 getDerivedStateFromProps
    if (JSON.stringify(echoData) !== JSON.stringify(prevEchoData) && echoData && echoData.length > 0) {
        // echoData 自上次渲染以来发生过改变。更新 数据
        const _checkedList = echoData || [];
        setIndeterminate(!!_checkedList.length && _checkedList.length < data.length);
        setCheckAll(_checkedList.length === data.length);
        setCheckedList(_checkedList);
        setPrevEchoData(echoData);
    }

    const onCheckAllChange = (e) => {
        const _checkedList = e.target.checked ? data.map((item) => item.id) : [];
        const checkAll = e.target.checked;
        setCheckAll(checkAll);
        setCheckedList(_checkedList);
        setIndeterminate(false);
        if (checkallChange) checkallChange(_checkedList);
    };
    const onChange = (_checkedList) => {
        setCheckAll(_checkedList.length === data.length);
        setCheckedList(_checkedList);
        setIndeterminate(!!_checkedList.length && _checkedList.length < data.length);
        if (changeItem) changeItem(_checkedList);
    };
    const spanValue = 24 / columns;
    return (
        <React.Fragment>
            <div className='check-all'>
                <Checkbox indeterminate={indeterminate} onChange={(e) => onCheckAllChange(e)} checked={checkAll}>
                    全选
                </Checkbox>
            </div>
            <br />
            <Checkbox.Group onChange={(checkedValues) => onChange(checkedValues)} value={checkedList}>
                <Row>
                    {data.map(({ id, name }) => (
                        <Col key={id} span={spanValue}>
                            <Checkbox value={id}>{name}</Checkbox>
                        </Col>
                    ))}
                </Row>
            </Checkbox.Group>
        </React.Fragment>
    );
}
