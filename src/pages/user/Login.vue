<template>
  <content-layout fullPage>
    <a-form
      class="login-form-wrap"
      :form="form"
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-item label="用户名">
        <a-input
          :placeholder="formData.userName.placeholder"
          v-decorator="formData.userName.decorator"
        />
      </a-form-item>
      <a-form-item label="密码">
        <a-input
          type="password"
          :placeholder="formData.password.placeholder"
          v-decorator="formData.password.decorator"
        />
      </a-form-item>
      <div style="text-align:center;">
        <a-button type="primary" @click="login">
          登录
        </a-button>
      </div>
    </a-form>
  </content-layout>
</template>

<script>
import Http from '../../utils/Http.js'
import { loginForm } from './form';
import ContentLayout from '../../components/layout/ContentLayout';
export default {
  components: { ContentLayout },
  data() {
    return {
      formData: loginForm,
      form: this.$form.createForm(this, {}),
    }
  },
  methods: {
    login(id) {
      const self = this;
      self.form.validateFields((err, values) => {
        if (!err) {
          new Http().request({
            url: `/user/login`,
            method: 'post',
            data: values
          }).then(data => {
            const backUrl = self.$route.query.backUrl
            self.$router.push({ path: backUrl || '/' })
          }).catch(err => {
          })
        }
      });
    }
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.login-form-wrap {
  width: 800px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 2%;
}
</style>