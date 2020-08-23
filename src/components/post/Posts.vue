<template>
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
            <a-tag color="pink" v-for="(tag,index) in item.tags" :key="index">
              {{tag}}
            </a-tag>
          </div>
          <div class="date">{{ item.publishTime }}</div>
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
</template>

<script>
import Http from '../../utils/Http.js'
export default {
  data() {
    return {
      list: [],
    };
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