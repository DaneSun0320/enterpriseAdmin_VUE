<template>
  <el-row :gutter="30">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">物资录入</div>
        </el-row>
        <el-row type="flex" class="card-content">
          <el-form ref="form" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="物资名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
            <el-form-item label="规格" prop="specification">
              <el-input v-model="form.specification"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="num">
              <el-input-number v-model="form.num" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">提交</el-button>
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
    return {
      form: {
        name: '',
        num: 0,
        specification: '个'
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        specification: [
          { required: true, message: '请填写规格', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      var that = this
      if (parseInt(this.form.num) === 0) return
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.$axios.post('addgoods/', {
            name: that.form.name,
            amount: that.form.num,
            specification: that.form.specification,
            operator: that.$store.state.id
          })
            .then(function (res) {
              if (res.data.status === 1) {
                that.$notify({
                  type: 'success',
                  title: '成功',
                  message: '添加成功'
                })
                that.form = {
                  name: '',
                  num: 0,
                  specification: '个'
                }
              } else {
                that.$notify({
                  type: 'error',
                  title: '失败',
                  message: '添加失败'
                })
              }
            })
        } else {
          return false
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
