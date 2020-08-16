<template>
  <content-layout>
    <div class="markdown-body" v-html="htmlData">
    </div>
  </content-layout>
</template>

<script>
import Http from '../utils/Http.js'
import ContentLayout from '../components/layout/ContentLayout'
export default {
  components: { ContentLayout },
  data(){
    return {
      htmlData:''
    }
  },
  created() {
    const self = this;
    new Http().request({
      url: `/posts/${this.$route.params.id}`
    }).then(data => {
      self.htmlData = data
    }).catch(err => { })
  }
}
</script>

<style lang="scss" scoped>
.markdown-body {
  word-break: break-word;
  line-height: 1.75;
  font-weight: 400;
  font-size: 15px;
  color: #333;
  h2 {
    padding-bottom: 12px;
    font-size: 24px;
    border-bottom: 1px solid #ececec;
  }
  p {
    line-height: inherit;
    margin-top: 22px;
    margin-bottom: 22px;
  }
  strong {
    background-color: #fff5f5;
    color: #ff502c;
    font-size: 0.87em;
    padding: 0.065em 0.4em;
  }
  pre {
    line-height: 0;
    overflow: hidden;
    code {
      line-height: 1.75;
      display: block;
      padding: 18px 15px 12px;
      color: #333;
      background: #f8f8f8;
      overflow: auto;
    }
  }
}
</style>