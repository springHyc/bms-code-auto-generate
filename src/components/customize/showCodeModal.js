import { Button, message, Modal } from 'antd';
import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import './index.less';
import axios from 'axios-jsonp-pro';
import API from './api';

export default function ShowCodeModal(props) {
    const { visible, indexCodeStr, close, columnsCodeStr } = props;
    const [down, setDown] = useState(false);
    const copyFn = () => {
        copy(indexCodeStr);
        message.success('复制成功！');
    };

    const downFile = () => {
        window.open(`${API.URL}down`);
    };

    const generateCode = () => {
        axios
            .post(`${API.URL}generate-files`, {
                code: indexCodeStr,
                columnsCodeStr
            })
            .then((res) => {
                if (res.data.code === 0) {
                    message.success(res.data.message);
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
                <Button key='code' onClick={generateCode}>
                    生成文件
                </Button>,
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
