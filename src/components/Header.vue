<template>
  <div>
    <!----------------修改密码------------------->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <span>
        <el-form ref="form"  :model="form" :rules="rule" label-width="80px">
          <el-form-item label="原密码" prop="originalPassword">
            <el-input v-model="form.originalPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repeatPassword">
            <el-input v-model="form.repeatPassword" show-password></el-input>
          </el-form-item>
        </el-form>
        <span style="margin-left: 0px">
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
          </span>
      </span>
    </el-dialog>
    <!-------------------------Header----------------------------->
    <el-row class="header" :gutter="20">
      <el-col :span="4"><img style="width: 200px;height: 34px;margin-top: 10px" src="../assets/logo.png"></el-col>
      <el-col :span="8" style="margin: auto">
      </el-col>
      <el-col :span="8">
      </el-col>
      <el-col class="login-user" :span="4">
        <span style="color: rgba(92,94,104,1);">欢迎,</span>
        <el-dropdown class=" user-name"
                     @command="handleCommand">
          <span class="el-dropdown-link"
                style="color: #409eff;"
                >
          {{$store.state.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="exit">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  data () {
    var validateNewPwd = (rule, value, callback) => {
      if (this.form.originalPassword === value) {
        callback(new Error('新密码与旧密码不能相同！'))
      } else {
        callback()
      }
    }
    var validateComfirmPwd = (rule, value, callback) => {
      if (this.form.newPassword !== value) {
        callback(new Error('两次密码输入不一致！'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      form: {
        originalPassword: '',
        newPassword: '',
        repeatPassword: ''
      },
      rule: {
        originalPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, message: '密码至少为6位！', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码至少为6位！', trigger: 'blur' },
          { validator: validateNewPwd, trigger: 'blur' }
        ],
        repeatPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 6, message: '密码至少为6位！', trigger: 'blur' },
          { validator: validateComfirmPwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false
      this.form = {
        originalPassword: '',
        newPassword: '',
        repeatPassword: ''
      }
    },
    submitForm (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('updatepassword/', {
            id: that.$store.state.staffId,
            oldPassword: that.$md5(that.form.originalPassword),
            newPassword: that.$md5(that.form.newPassword)
          })
            .then(function (res) {
              switch (res.data.status) {
                case 1:
                  that.$notify({
                    type: 'success',
                    title: '修改成功'
                  })
                  that.handleClose()
                  break
                case -1:
                  that.$notify.error({
                    title: '修改失败',
                    message: '旧密码输入不正确'
                  })
                  that.from.originalPassword = ''
                  break
                case 0:
                  that.$notify({
                    type: 'error',
                    title: '修改失败，请稍后再试！'
                  })
                  that.handleClose()
                  break
              }
            })
        }
      })
    },
    handleCommand (command) {
      console.log(command)
      if (command === 'changePassword') {
        this.dialogVisible = true
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
  .header{
    display: flex;
    text-align: center;
    justify-content: center;
    height: 100%;
  }
  .login-user{
    display: flex;
    color: #000;
    font-weight: bold;
    align-items: center;
    justify-content: center;
  }
  .user-name:hover {
    color: #0348fe;
  }
  .el-breadcrumb ::v-deep .el-breadcrumb__inner {
    color: #fff !important;
  }

</style>
