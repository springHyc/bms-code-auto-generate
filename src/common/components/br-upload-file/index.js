import React from 'react';
import { UploadOutlined, DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import './index.less';
import _ from 'lodash';

/**
 * * 上传文件，暂时不支持回显，支持多文件上传 <br/>
 * * 可删除文件<br/>
 * * @param {function} saveFileBase64 是一个高阶函数，返回的方法将文件的base64数据保存至父组件
 *    * e.g. `saveFileBase64={() => {return (datas) => console.log('上传的文件是：', datas);}}`
 *    * 保存的值是：[{fileName: 'xxx.doc', value: 'xxxx'}]<br/>
 * * @param {string} accept : 可以接受的文件的参数类型<br/>
 * * @param {boolean} maxConunt : 上传文件的最大数量，不填则默认为1
 * * @param {boolean} showDelete: 是否展示删除按钮，默认不展示。
 * * @param {boolean} disabled : 该组件是否可用，默认为false。
 * * @param {boolean} loading: 该组件是否在上传文件中，默认为false。
 */
export default class BrUploadFile extends React.Component {
    state = {
        fileNames: [],
        maxCount: this.props.maxCount,
        showDelete: this.props.showDelete
    };

    fileInput = React.createRef();
    fileBase64Values = [];
    uid = new Date().valueOf();

    changeFileName = (maxCount = 1, file) => {
        this.setState((state) => {
            const deleteLen = state.fileNames.length - (maxCount - 1);
            if (deleteLen > 0) {
                for (let i = 0; i < deleteLen; i++) {
                    state.fileNames.shift();
                }
            }
            return state.fileNames.push(file.name);
        });
    };

    saveFileBase64 = (maxCount = 1, file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const base64 = e.target.result.split(',');
            const deleteLen = this.fileBase64Values.length - (maxCount - 1);
            if (deleteLen > 0) {
                for (let i = 0; i < deleteLen; i++) {
                    this.fileBase64Values.shift();
                }
            }
            this.fileBase64Values.push({
                file: file,
                value: base64[1]
            });
            this.props.saveFileBase64()(this.fileBase64Values);
        };
    };

    onUploadChange = (e) => {
        const [file] = e.target.files;
        this.changeFileName(this.state.maxCount, file);
        this.saveFileBase64(this.state.maxCount, file);
    };

    deleteFile = (fileName) => {
        this.setState((state) => {
            return _.remove(state.fileNames, (item) => {
                return item === fileName;
            });
        });
        _.remove(this.fileBase64Values, (item) => {
            return item.file.name === fileName;
        });
        this.props.saveFileBase64()(this.fileBase64Values);
    };
    render() {
        const { accept, disabled = false, loading = false } = this.props;
        const showDelete = this.state.showDelete || false;
        return (
            <div className='br-upload-file'>
                <input
                    ref={(node) => (this.fileInput = node)}
                    type='file'
                    id={this.uid}
                    style={{ display: 'none' }}
                    onChange={this.onUploadChange}
                    accept={accept}
                />
                <Button
                    icon={<UploadOutlined />}
                    onClick={() => {
                        document.getElementById([this.uid]).click();
                    }}
                    disabled={disabled}
                    loading={loading}
                >
                    上传
                </Button>
                {this.state.fileNames &&
                    this.state.fileNames.map((fileName) => {
                        return (
                            <div className='br-upload-file-btn-wrapper' key={fileName}>
                                <PaperClipOutlined />
                                <span>{fileName}</span>
                                {showDelete && <DeleteOutlined onClick={() => this.deleteFile(fileName)} />}
                            </div>
                        );
                    })}
            </div>
        );
    }
}
