import 'moment/locale/zh-cn';

export default [
    {
        title: '代理公司',
        dataIndex: 'channelCompanyName',
        tooLong: true,
        copy: true
    },
    {
        title: '应用名称',
        dataIndex: 'channelAppName'
    },
    {
        title: '渠道类别',
        dataIndex: 'channelTypeName'
    },
    {
        title: '渠道名称',
        dataIndex: 'channelName',
        tooLong: true
    },
    {
        title: '账户名称',
        dataIndex: 'channelAccount',
        render: (value) => (!value ? '无' : value)
    },
    {
        title: '渠道ID',
        dataIndex: 'channelId',
        copy: true
    },
    {
        title: '负责人',
        dataIndex: 'principalShow',
        render: (value) => (!value ? '无' : value)
    }
];
