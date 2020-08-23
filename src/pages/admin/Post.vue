<template>
  <content-layout>
    <!-- 操作 -->
    <!-- table -->
    <a-table :columns="columns" :data-source="list" key="_id">
      <span slot="action" slot-scope="">
        <a>检查</a>
      </span>
    </a-table>
  </content-layout>
</template>

<script>
import ContentLayout from '../../components/layout/ContentLayout'
import postColumns from './data/postColumns'
import Http from '../../utils/Http.js'
export default {
  components: { ContentLayout },
  data() {
    return {
      columns: postColumns,
      list: [],
    }
  },
  created() {
    const self = this;
    new Http().request({
      url: '/posts',
      data: {
        page: 1,
        pageSize: 10
      }
    }).then(data => {
      self.list = data.list
      console.log(data.list)
    }).catch(err => { })
  }
}
</script>

<style>
</style>