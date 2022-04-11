<template>
  <el-row :gutter="30">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">今日打卡数据</div>
        </el-row>
        <el-row type="flex" style="padding-left: 20px;padding-right: 20px">
              <el-table
                ref="filterTable"
                :data="todayList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                style="width: 100%">
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
                  width="160"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="姓名"
                  width="160">
                </el-table-column>
                <el-table-column
                  prop="tempture"
                  label="体温"
                  width="160"
                >
                </el-table-column>
                <el-table-column
                  prop="start_time"
                  label="打卡时间"
                  width="160">
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
</template>

<script>
export default {
  data () {
    return {
      todayList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created () {
    this.getAttendance()
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
    getAttendance () {
      var that = this
      this.$axios.get('todayattendance/')
        .then(function (res) {
          if (res.data.status === 1) {
            that.todayList = res.data.data
            that.total = res.data.data.length
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '数据获取失败'
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
</style>
