<template>
  <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
    <a-form-item label="userName">
      <a-input v-model="user.userName" />
    </a-form-item>
    <a-form-item label="password">
      <a-input v-model="user.password" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" @click="login">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import Http from '../../utils/Http.js'
export default {
  data() {
    return {
      user: {
        uesrName: '',
        password: '',
      }
    }
  },
  methods: {
    login(id) {
      const self = this;
      new Http().request({
        url: `/user/login`,
        method: 'post',
        data: {
          userName: self.user.userName,
          password: self.user.password,
        }
      }).then(data => {
      }).catch(err => { })
    }
  },
  created() {
  }
}
</script>

<style>
</style>