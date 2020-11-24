import React from 'react';
import { Modal } from 'antd';
import GenerateService from './generate-service';

export default class CodeShowModal extends React.Component {
    save = () => {
        debugger;
        const brPageCode = document.getElementById('br-page');
        const brInput = document.getElementById('br-input');
        brInput.value = brPageCode.innerHTML;
        brInput.select();
        document.execCommand('Copy');
        // this.props.onOk();
    };
    render() {
        const { visible, onOk, onCancel, areas } = this.props;
        return (
            <Modal visible={visible} onOk={() => this.save()} onCancel={onCancel} style={{ width: '100%!important' }} className='show-code'>
                <div style={{ display: 'none' }}>{areas && GenerateService.generateCode(areas)}</div>
                <input id='br-input' />
            </Modal>
        );
    }
}
