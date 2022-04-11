<template>
  <div class="page-module login-container backgroundCover flex width_100 height_100">
    <div class="login-panel" @keyup.enter="onSubmit">
      <div class="head-text align_center">
        <img style="width: 280px;height: 40px;" src="../assets/logo.png">
      </div>
      <el-form class="login-form" size="medium" :model="form" :rules="rules" ref="form">
        <el-form-item label="职工号" prop="username" >
          <el-input placeholder="请输入职工号" autofocus v-model="form.username"/>
        </el-form-item>
        <el-form-item  label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
        </el-form-item>
      </el-form>
      <div style="display: flex;justify-content: center;">
          <el-button type="primary" class="width_100" icon="el-icon-check" @click="submit" :loading="submitLoad"/>
        </div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: null,
        password: null
      },
      rules: {
        username: [{ required: true, message: '请输入账户名！', trigger: 'blur' }],
        password: [{ required: true, message: '请输入账户密码！', trigger: 'blur' }]
      },
      submitLoad: false
    }
  },
  methods: {
    submit: function () {
      var that = this
      // 设置按钮加载状态
      this.submitLoad = true
      setTimeout(function () {
        that.submitLoad = false
      }, 3000)
      // 构造post数据
      var data = {
        id: this.form.username,
        password: this.$md5(this.form.password)
      }
      this.$axios.post('login/', data)
        .then(function (response) {
          const status = response.data.status
          switch (status) {
            // 登录成功
            case 1:
              // status=1 登陆成功
              that.$store.state.staffId = response.data.id
              that.$store.state.name = response.data.name
              that.$store.state.sectorId = response.data.sector
              that.$store.state.level = response.data.level
              that.$message.success('登陆成功')
              that.$store.state.token = response.data.token
              that.$axios.defaults.headers.Authorization = response.data.token
              window.sessionStorage.setItem('token', response.data.token)
              window.sessionStorage.setItem('staffId', response.data.id)
              window.sessionStorage.setItem('sectorId', response.data.sector)
              window.sessionStorage.setItem('name', response.data.name)
              window.sessionStorage.setItem('level', response.data.level)
              that.$router.push('/')
              break
            case 0:
              // status=0 校验失败
              that.$message.error('用户名或密码错误！')
              break
            case -1:
              that.$message.error('登录失败！')
              break
            case -2:
              that.$message.error('登录接口异常！')
              break
          }
          // 按钮取消按钮加载状态
          that.submitLoad = false
        })
    }
  }
}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .login-container {
    min-height: 100vh;
    display: flex;
    margin: auto;
    background-image: url(../assets/login_body.jpg);
    width: 100%;
    z-index: 1;
  }
  .login-container:after{
    content: "";
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    background: inherit;
    filter: blur(12px);
    z-index: 2;
  }
  .login-panel {
    z-index: 999;
    margin: auto;
    padding: 25px 15px;
    width: 500px;
    border-radius: 18px;
    background-color: #fff;
  }
  .head-text {
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
  }
</style>
