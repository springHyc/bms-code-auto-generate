import { Button, Col, Input, message, Modal, Popover, Row } from 'antd';
import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import './index.less';
import axios from 'axios-jsonp-pro';
import API from './api';

export default function ShowCodeModal({ visible, indexCodeStr, close, columnsCodeStr = null }) {
    const [down, setDown] = useState(false);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [moduleName, setModuleName] = useState();
    const copyFn = () => {
        copy(indexCodeStr);
        message.success('复制成功！');
    };

    const downFile = () => {
        window.open(`${API.URL}table/down?moduleName=${moduleName}`);
    };

    const generateCode = () => {
        axios
            .post(
                `${API.URL}table/generate-files`,
                {
                    code: indexCodeStr,
                    columnsCodeStr
                },
                {
                    params: {
                        moduleName
                    }
                }
            )
            .then((res) => {
                if (res.data.code === 0) {
                    message.success(res.data.message);
                    setPopoverVisible(false);
                    setDown(true);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <Modal
            title='代码展示'
            visible={visible}
            className='show-code-modal'
            onCancel={close}
            footer={[
                <Button key='back' onClick={close}>
                    返回
                </Button>,
                <Button key='down' disabled={!down} onClick={downFile}>
                    下载
                </Button>,
                <Popover
                    content={
                        <Row justify='center' align='middle'>
                            <Col>模块名:</Col>
                            <Col>
                                <Input onChange={(e) => setModuleName(e.target.value)} />
                            </Col>
                            <Button type='primary' onClick={generateCode}>
                                确定
                            </Button>
                        </Row>
                    }
                    trigger='click'
                    placement='bottomLeft'
                    visible={popoverVisible}
                    onVisibleChange={(visible) => setPopoverVisible(visible)}
                >
                    <Button key='code' onClick={() => setPopoverVisible(true)}>
                        生成文件
                    </Button>
                </Popover>,
                <Button key='submit' type='primary' onClick={copyFn}>
                    复制
                </Button>
            ]}
            afterClose={() => setDown(false)}
        >
            <textarea readOnly style={{ width: '100%', height: '400px', border: '1px double burlywood' }} value={indexCodeStr} />
        </Modal>
    );
}
