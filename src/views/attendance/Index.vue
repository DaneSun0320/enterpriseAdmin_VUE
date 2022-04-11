<template>
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-card shadow="hover">
            <el-row type="flex"  justify="space-between">
              <div class="card-title"><img class="card-title-icon" src="../../assets/icon/attendance.png">已打卡人数</div>
            </el-row>
            <el-row type="flex" class="card-total">
              {{allForm.length}}人
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <el-row type="flex"  justify="space-between">
              <div class="card-title"><img class="card-title-icon" src="../../assets/icon/exception.png">体温异常人数</div>
            </el-row>
            <el-row type="flex" class="card-total">
              {{exceptionForm.length}}人
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <el-row type="flex"  justify="space-between">
              <div class="card-title"><img class="card-title-icon" src="../../assets/icon/outgoing.png">出差人数</div>
            </el-row>
            <el-row type="flex" class="card-total">
              {{outsideNumber}}人
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="24">
          <el-card shadow="hover">
            <el-row type="flex"  justify="space-between">
              <div class="card-title">异常人员明细</div>
            </el-row>
            <el-row type="flex">
              <el-table
                style="width: 100%"
                :data="exceptionForm.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                <el-table-column
                  prop="staffId"
                  label="员工编号"
                  width="150"
                >
                </el-table-column>
                <el-table-column
                    prop="uid"
                    label="员工卡编号"
                    width="150"
                  >
                </el-table-column>
                <el-table-column
                  prop="sector"
                  label="部门"
                  width="150"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="姓名"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="tempture"
                  label="体温"
                  width="150"
                >
                </el-table-column>
                <el-table-column
                  prop="start_time"
                  label="打卡时间"
                  width="150">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.checkTempture === null"
                      size="mini"
                      @click="checkTempture(scope.$index, scope.row)">人工复核</el-button>
                    <el-tag
                      v-else
                      :type="scope.row.checkTempture > 37 ? 'danger' : 'success'"
                      disable-transitions>{{scope.row.checkTempture > 37 ? '复核异常' : '复核正常'}}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[1, 2, 5, 50]"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="parseInt(total)"
              background
              style="margin-top: 10px;">
            </el-pagination>
          </el-card>
        </el-col>
      </el-row>
      <el-dialog title="异常人员复核" :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="体温">
            <el-input v-model="form.tempture" onkeyup="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="复核人">
            <el-input disabled v-model="form.operator"></el-input>
          </el-form-item>
          <el-form-item>
          <el-button
            size="mini"
            @click="submit()">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      form: {
        tempture: null,
        id: null,
        operator: this.$store.state.name
      },
      dialogVisible: false,
      exceptionForm: [],
      allForm: [],
      outsideNumber: 0
    }
  },
  created () {
    this.getTodayExcept()
    this.getAttendance()
    this.getOutsideNumber()
  },
  methods: {
    handleSizeChange (newSize) {
      // pagesize改变触发
      this.pageSize = newSize
    },
    handleCurrentChange (newPage) {
      // 页码改变触发
      this.currentPage = newPage
    },
    checkTempture (index, row) {
      this.dialogVisible = true
      this.form.id = row.id
    },
    submit () {
      var that = this
      this.$axios.post('checktempture/', {
        id: that.form.id,
        tempture: that.form.tempture,
        operator: that.$store.state.staffId
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.getTodayExcept()
            that.$notify({
              type: 'success',
              title: '成功'
            })
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '数据获取失败'
            })
          }
          that.dialogVisible = false
          that.form.id = null
          that.form.tempture = null
        })
    },
    getAttendance () {
      var that = this
      this.$axios.get('todayattendance/')
        .then(function (res) {
          if (res.data.status === 1) that.allForm = res.data.data
          else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '数据获取失败'
            })
          }
        })
    },
    getOutsideNumber () {
      var that = this
      this.$axios.get('outsidenumber/')
        .then(function (res) {
          if (res.data.status === 1) that.outsideNumber = res.data.data
          else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '数据获取失败'
            })
          }
        })
    },
    getTodayExcept () {
      var that = this
      this.$axios.get('todayexcept/')
        .then(function (res) {
          if (res.data.status === 1) {
            that.exceptionForm = res.data.data
            that.total = res.data.data.length
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '异常人员数据获取失败'
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
  .card-title-icon{
    height: 40px;
    width: 40px;
    margin-right: 10px;;
  }
  .card-total {
    display: flex;
    font-size: 22px;
    font-weight: bold;
    color:gray;
    justify-content: flex-end;
  }

</style>
