<template>
  <div class="login">
    <el-form
    class="login-form"
    label-position="top"
    ref="form"
    :model="form"
    :rules="rules"
    label-width="80px"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
        type="primary"
        class="login-bth"
        @click="onSubmit"
        :loading="isLoginLoading"
        >立即登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { login } from '@/services/user'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      isLoginLoading: false,
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度为6-18个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        await (this.$refs.form as Form).validate()// 表达验证
        this.isLoginLoading = true
        const { data } = await login(this.form)
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          this.$store.commit('setUser', data.content)
          this.$router.push(this.$route.query.redirect as string || '/')
          this.$message.success('登录成功')
        }
      } catch (err) {
        console.log('登录失败', err)
      }
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('~@/assets/login-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .login-form {
    width: 300px;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    .login-bth {
      width: 100%;
    }
  }
}
</style>
