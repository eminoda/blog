<template>
  <div>
    <a-list item-layout="horizontal" :data-source="list" class="list-wrap">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta>
          <router-link
            slot="title"
            :to="{ path: `/post/${item._id}` }"
            class="title"
            >{{ item.title }}</router-link
          >
          <div slot="description">
            <div>
              <a-tag
                color="pink"
                v-for="(tag, index) in item.tags"
                :key="index"
                >{{ tag }}</a-tag
              >
            </div>
            <div class="date">{{ item.publishTime | dateTimeFilter }}</div>
          </div>
        </a-list-item-meta>
        <img
          slot="extra"
          width="150"
          alt="logo"
          src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
        />
      </a-list-item>
    </a-list>
    <a-pagination
      :default-current="1"
      :defaultPageSize="pagnation.pageSize"
      :total="pagnation.total"
      @change="onChange"
    />
  </div>
</template>

<script>
import Http from '../../utils/Http.js';
export default {
  data() {
    return {
      list: this.$store.state.posts || [],
      pagnation: {
        page: 1,
        pageSize: 5,
        total: this.$store.state.postsTotalCount || 0
      }
    };
  },
  methods: {
    onChange(page) {
      this.pagnation.page = page
      this.queryList()
    },
    queryList() {
      const self = this;
      new Http()
        .request({
          url: '/posts',
          data: {
            page: self.pagnation.page,
            pageSize: self.pagnation.pageSize,
          },
        })
        .then((data) => {
          self.list = data.list;
          self.pagnation.total = data.total
        })
        .catch((err) => { });
    }
  },
  created() { },
  mounted() {
    // this.queryList()
  },
};
</script>

<style scoped lang="scss">
.list-wrap {
  .ant-list-item-meta-title {
    font-size: 20px;
    margin-bottom: 15px;
  }
  .date {
    margin-top: 5px;
    font-size: 14px;
  }
}
</style>
