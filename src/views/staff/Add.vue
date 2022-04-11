<template>
  <el-row :gutter="30">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">员工录入</div>
        </el-row>
        <el-row type="flex" class="card-content">
          <el-form ref="form" :rules="rule" :model="form" label-width="100px">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option label="男" :value=true></el-option>
                <el-option label="女" :value=false></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input v-model.number="form.age"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model.number="form.phone"></el-input>
            </el-form-item>
            <el-form-item
              prop="email"
              label="邮箱">
              <el-input v-model="form.email" ></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="sector">
              <el-select v-model="form.sector" placeholder="请选择">
                <el-option
                  v-for="item in sector"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span>{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input v-model="form.position"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">提交</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    var validateAge = (rule, value, callback) => {
      if (!/(^[1-9]\d*$)/.test(value) || (value <= 18 || value >= 100)) {
        callback(new Error('请输入正确的年龄！'))
      } else {
        callback()
      }
    }
    var validatePhone = (rule, value, callback) => {
      if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
        callback(new Error('请输入正确的联系电话！'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!/^\w+@[a-zA-Z0-9]+((\.[a-z0-9A-Z]{1,})+)$/.test(value)) {
        callback(new Error('请输入正确的邮箱！'))
      } else {
        callback()
      }
    }
    return {
      rule: {
        name: { required: true, message: '请输入姓名', trigger: 'blur' },
        sex: { required: true, message: '请输入性别', trigger: 'blur' },
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: validateAge, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        sector: { required: true, message: '请输入职位', trigger: 'blur' },
        position: { required: true, message: '请输入职位', trigger: 'blur' }
      },
      sector: [],
      form: {
        name: '',
        sex: null,
        age: null,
        phone: '',
        email: '',
        sector: null,
        position: ''
      }
    }
  },
  created () {
    this.getSector()
  },
  methods: {
    submitForm (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('addstaff/', {
            name: that.form.name,
            age: that.form.age,
            sex: that.form.sex,
            phone: that.form.phone,
            email: that.form.email,
            sector: that.form.sector,
            position: that.form.position
          })
            .then(function (res) {
              if (res.data.status === 1) {
                that.$notify({
                  type: 'success',
                  title: '添加成功'
                })
                that.$router.push('/staff/data')
                that.form = {
                  name: '',
                  sex: null,
                  age: null,
                  phone: '',
                  email: '',
                  sector: null,
                  position: ''
                }
              } else {
                that.$notify({
                  type: 'error',
                  title: '添加失败'
                })
              }
            })
        }
      })
    },
    getSector () {
      var that = this
      this.$axios.get('sectorlist/')
        .then(function (res) {
          if (res.data.status === 1) that.sector = res.data.data
          else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '部门数据获取失败'
            })
          }
        })
    }
  }
}
</script>

<style scoped>
  .el-card {
    border-radius: 15px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .card-content{
    padding-top: 20px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .el-row{
    margin-bottom: 20px;
  }
  .card-title{
    display: flex;
    text-align: start;
    margin-left: 10px;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }
</style>
