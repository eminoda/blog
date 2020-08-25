import moment from 'moment';
export default [
  {
    title: 'ID',
    width: 50,
    customRender(text, record, index) {
      console.log(index);
      return index + 1;
    },
  },
  {
    title: '文件名',
    width: 150,
    dataIndex: 'title',
  },
  {
    title: '标签',
    width: 150,
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' },
  },
  {
    title: '发布时间',
    width: 150,
    dataIndex: 'publishTime',
    customRender(text) {
      return moment(text).format('YYYY-MM-DD HH:MM:ss');
    },
  },
  {
    title: '创建时间',
    width: 150,
    dataIndex: 'createTime',
    customRender(text) {
      return moment(text).format('YYYY-MM-DD HH:MM:ss');
    },
  },
  {
    title: '操作',
    width: 250,
    align: 'center',
    // fixed: 'right',
    scopedSlots: { customRender: 'action' },
  },
];
