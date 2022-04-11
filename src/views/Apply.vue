<template>
  <el-container id="app">
    <el-main>
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">出差申请</div>
        </el-row>
        <el-row  type="flex" style="margin: 20px;margin-top: 40px;">
          <el-form ref="form" :model="form" :rules="rule" label-width="100px">
            <el-form-item  label="员工编号" prop="id">
              <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="出差地"  prop="outPlace">
              <el-cascader
                style="padding: 0"
                :options="options"
                v-model="selectedOptions"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="出差日期" label-width="100px" prop="date">
              <el-date-picker
                v-model="form.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-button type="primary" @click="submit('form')">提交</el-button>
          </el-form>
        </el-row>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  data () {
    var validateId = (rule, value, callback) => {
      if (!/^\d+$/.test(value)) {
        callback(new Error('请输入正确的员工编号！'))
      } else {
        callback()
      }
    }

    return {
      form: {
        id: null,
        outPlace: {
          province: '',
          city: '',
          district: ''
        },
        date: ''
      },
      options: regionData,
      selectedOptions: [],
      rule: {
        id: [{ required: true, message: '请输入员工编号！', trigger: 'blur' },
          { validator: validateId, trigger: 'blur' }
        ],
        outPlace: [{ required: true, message: '请选择出差地点！', trigger: 'blur' }],
        date: { required: true, message: '请选择出差时间！', trigger: 'blur' }
      }
    }
  },
  methods: {
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var that = this
          this.$axios.post('applyoutside/', {
            id: that.form.id,
            province: that.form.outPlace.province,
            city: that.form.outPlace.city,
            district: that.form.outPlace.district,
            date: that.form.date
          })
            .then(function (res) {
              if (res.data.status === 1) {
                that.$message.success('申请成功')
                that.selectedOptions = []
                that.form = {
                  id: null,
                  outPlace: {
                    province: '',
                    city: '',
                    district: ''
                  },
                  date: ''
                }
              } else that.$message.error('申请失败')
            })
        }
      })
    },
    handleChange () {
      var loc = []
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc.push(CodeToText[this.selectedOptions[i]])
      }
      this.form.outPlace.province = loc[0]
      this.form.outPlace.city = loc[1]
      this.form.outPlace.district = loc[2]
    }
  }
}
</script>

<style scoped>
  #app {
    height: 100vh;
    display: flex;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #f1f7f7;
  }
  .card-title{
    display: flex;
    text-align: start;
    margin-left: 10px;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }
  .el-card {
    border-radius: 15px;
  }
  .el-row{
    margin-bottom: 20px;
  }
</style>
