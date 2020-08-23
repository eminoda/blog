import moment from 'moment';
export default [
  {
    title: 'ID',
    customRender(text, record, index) {
      console.log(index);
      return index + 1;
    },
  },
  {
    title: '文件名',
    dataIndex: 'name',
  },
  {
    title: '源文件',
    dataIndex: 'raw',
    ellipsis: true,
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '资源下载数',
    dataIndex: 'downCount',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    customRender(text) {
      return moment(text).format('YYYY-MM-DD HH:MM:ss');
    },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
];
