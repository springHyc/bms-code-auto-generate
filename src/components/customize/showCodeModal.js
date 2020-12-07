import { message, Modal } from 'antd';
import React from 'react';
import copy from 'copy-to-clipboard';
import './index.less';

export default function ShowCodeModal(props) {
    const { visible, source, close } = props;
    const copyFn = () => {
        copy(source);
        message.success('复制成功！');
    };

    return (
        <Modal title='代码展示' visible={visible} onCancel={close} okText='复制' onOk={copyFn} className='show-code-modal'>
            <textarea readOnly style={{ width: '100%', height: '400px' }} value={source} />
        </Modal>
    );
}
