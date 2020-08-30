<template>
  <div>
    <div class="operator-wrap">
      <a-input v-model="post.title" class="title" />
      <a-button type="primary" @click="save">保存</a-button>
    </div>
    <div class="viewer-wrap">
      <div class="viewer">
        <a-textarea
          class="preview"
          autoSize
          v-model="post.markdown"
          @change="updateMarkdownPreview"
        />
      </div>
      <div class="viewer">
        <div class="markdown-body" v-html="postHtml"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Http from '../../utils/Http.js'
import marked from 'marked'
export default {
  data() {
    return {
      post: {},
      postHtml: ''
    }
  },
  methods: {
    save() {
      const self = this;
      new Http().request({
        url: `/admin/save/postMarkdown`,
        method: 'post',
        data: {
          id: self.$route.params.id,
          title: self.post.title,
          markdown: self.post.markdown
        }
      }).then(data => {
        self.post = data
        self.$message.info('更新成功')
      }).catch(err => { })

    },
    queryDetail(id) {
      const self = this;
      new Http().request({
        url: `/posts/${id}`,
        data: {}
      }).then(data => {
        self.post = data
        self.postHtml = marked(self.post.markdown)
      }).catch(err => { })
    },
    updateMarkdownPreview(e) {
      this.postHtml = marked(e.target.value)
    }
  },
  created() {
    this.queryDetail(this.$route.params.id)
  }
}
</script>

<style scoped lang="scss">
.operator-wrap {
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-content: center;
  position: fixed;
  width: 100%;
  z-index: 10;
  box-shadow: 1px 3px 10px #ddd;
  padding: 15px 5%;
  .title {
    width: 30%;
    font-size: 18px;
    margin-right: 20px;
  }
}
.viewer-wrap {
  padding: 0 5%;
  padding-top: 52px;
  display: flex;
  justify-content: center;
  .viewer {
    width: 50%;
    padding: 20px;
    background-color: #fff;
    &:last-child {
      border-left: 1px solid #ddd;
    }
    .ant-input {
      border: none;
    }
  }
  .preview {
    white-space: pre-wrap;
  }
}
</style>