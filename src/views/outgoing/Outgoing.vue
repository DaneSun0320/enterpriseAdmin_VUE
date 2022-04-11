<template>
  <el-row :gutter="30">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">异地员工信息</div>
        </el-row>
        <el-row type="flex">
          <el-table
            :data="infoList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%">
            <el-table-column
              label="序号"
              width="100">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="100">
            </el-table-column>
            <el-table-column
              prop="sectorName"
              label="部门"
              width="100">
            </el-table-column>
            <el-table-column
              label="出差地"
              width="200">
              <template slot-scope="scope">
                {{scope.row.province + " " + scope.row.city + " " + scope.row.district}}
              </template>
            </el-table-column>
            <el-table-column
              prop="startDate"
              label="起始日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="endDate"
              label="结束日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="status"
              label="风险等级"
              width="120"
              :filters="[{ text: '低风险', value: 0 }, { text: '中风险', value: 1 }, { text: '高风险', value: 2 }]"
              :filter-method="filterTag"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 0 ? 'success' : scope.row.status === 1 ?'warning' : 'danger'"
                  disable-transitions>{{scope.row.status === 0 ? '低风险' : scope.row.status === 1 ?'中风险' : '高风险'}}</el-tag>
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
</template>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      infoList: []
    }
  },
  created () {
    this.getOutsideInfo()
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
    filterTag (value, row) {
      return row.status === value
    },
    getOutsideInfo () {
      var that = this
      this.$axios.get('outsideinfo/')
        .then(function (res) {
          if (res.data.status === 1) {
            that.infoList = res.data.data
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
</style>
