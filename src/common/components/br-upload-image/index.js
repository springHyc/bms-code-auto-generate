import React from 'react';
import './index.less';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

/**
 * 上传图片的组件，可对上传过的图片回显，需要图片的url。
 *
 * * @param data 对应的modal回显的数据
 * * @param size 上传的图片大小不能超过sizeM，默认为10
 * * @param saveImageBase64 是一个高阶函数，返回的方法将文件的base64数据保存至父组件
 *   * e.g. `saveImageBase64={() => {return (data) => {setBusinessLicense(data);};}}`
 */
export default function BrUploadImage({ data, saveImageBase64, size = 10 }) {
    const uid = new Date().valueOf();
    const ref = {
        [`${uid}ImageRef`]: React.createRef()
    };

    const handleUpload = (e, attri, iconId) => {
        const file = e.target.files[0];
        if (file.size / 1024 / 1024 > size) {
            message.error(`上传的图片大小不能超过${size}M!`);
            return false;
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                ref[`${uid}ImageRef`].current.setAttribute('src', e.target.result);
                ref[`${uid}ImageRef`].current.style.display = 'inline';
                const iconNode = document.getElementById(iconId);
                if (iconNode) {
                    iconNode.style.display = 'none';
                }
                const base64 = e.target.result.split(',');
                const imgContent = base64.length === 2 ? base64[1] : base64;
                saveImageBase64()(imgContent);
            };
        }
    };
    return (
        <div className='br-upload-image'>
            <div className='br-upload-image-img'>
                <img
                    id={`${uid}Id`}
                    ref={ref[`${uid}ImageRef`]}
                    style={(!data && { display: 'none' }) || {}}
                    src={data}
                    onClick={() => document.getElementById(`upload${uid}`).click()}
                />

                {!data && (
                    <PlusOutlined
                        id={`${uid}imageIcon`}
                        style={{ fontSize: '34px', color: '#9B9B9B' }}
                        onClick={() => {
                            document.getElementById(`upload${uid}`).click();
                        }}
                    />
                )}
                <input
                    type='file'
                    id={`upload${uid}`}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        const attri = `${uid}Id`;
                        const iconId = `${uid}imageIcon`;
                        handleUpload(e, attri, iconId);
                    }}
                    accept='image/png, image/jpg'
                />
            </div>
            <span className='br-upload-image-tip'>支持jpg/png格式，小于{size}M</span>
        </div>
    );
}
