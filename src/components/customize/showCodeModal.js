import { Button, message, Modal } from 'antd';
import React from 'react';
import copy from 'copy-to-clipboard';
import './index.less';
import axios from 'axios-jsonp-pro';

export default function ShowCodeModal(props) {
    const { visible, source, close } = props;
    const copyFn = () => {
        copy(source);
        message.success('复制成功！');
    };

    const generateCode = () => {
        axios
            .post('http://127.0.0.1:3001/files/generate', {
                code: source
            })
            .then((res) => {
                if (res.data.code === 0) {
                    message.success(res.data.message);
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
                <Button key='code' onClick={generateCode}>
                    生成文件
                </Button>,
                <Button key='submit' type='primary' onClick={copyFn}>
                    复制
                </Button>
            ]}
        >
            <textarea readOnly style={{ width: '100%', height: '400px', border: '1px double burlywood' }} value={source} />
        </Modal>
    );
}
