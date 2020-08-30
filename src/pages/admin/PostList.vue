<template>
  <content-layout>
    <!-- 操作 -->
    <!-- table -->
    <a-table
      key="_id"
      :columns="columns"
      :data-source="list"
      :pagination="pagination"
      :scroll="{ x: 1000 }"
      @change="handleChange"
    >
      <span slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" :key="tag" color="volcano">
          {{ tag }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="record">
        <a-tooltip>
          <template slot="title">
            在线预览
          </template>
          <a-button
            type="primary"
            size="small"
            icon="form"
            :disabled="!!!record.markdown"
            @click="$router.push({ path: `/admin/posts/${record._id}` })"
          />
        </a-tooltip>

        <a-tooltip>
          <template slot="title">
            解析文章属性（title，tags）
          </template>
          <a-button
            type="primary"
            size="small"
            icon="file-sync"
            :disabled="!!(record.title && record.markdown)"
            @click="parsePostProps(record._id)"
          />
        </a-tooltip>

        <a-button type="primary" size="small" icon="picture" />
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
      pagination: {
        total: 0,
        page: 1,
      }

    }
  },
  methods: {
    handleChange(pagination, filters, sorter) {
      this.pagination.page = pagination.current
      this.queryList()
    },
    parsePostProps(id) {
      new Http().request({
        url: '/admin/parse/postProps',
        method: 'post',
        data: { id }
      }).then(data => {
        this.queryList()
      }).catch(err => { })
    },
    queryList() {
      const self = this;
      new Http().request({
        url: '/posts',
        data: {
          page: self.pagination.page,
          pageSize: 10
        }
      }).then(data => {
        self.list = data.list
        self.pagination.total = data.total
      }).catch(err => { })
    }
  },
  created() {
    this.queryList()
  }
}
</script>

<style>
</style>