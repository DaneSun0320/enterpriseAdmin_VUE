<template>
  <el-row :gutter="30">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">授权管理</div>
        </el-row>
        <el-row type="flex">
          <el-table
            ref="filterTable"
            :data="staffList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%">
            <el-table-column
              label="序号"
              width="150">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="150">
            </el-table-column>
            <el-table-column
              prop="sectorName"
              label="部门"
              width="150">
            </el-table-column>
            <el-table-column
              prop="position"
              label="职位"
              width="150">
            </el-table-column>
            <el-table-column
              prop="level"
              label="系统权限"
              effect="plain"
              width="180">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.level === 0 ? 'info' : scope.row.status === 1 ?'success' : ''"
                  disable-transitions>{{scope.row.level === 0 ? '无权限' : scope.row.level === 1 ?'子管理员' : '超级管理员'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="160">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  :type="scope.row.level == 0 ? 'primary' : ''"
                  :disabled="$store.state.level < 2 || scope.row.id === $store.state.staffId"
                  @click="handleApprove(scope.row,scope.row.level == 0 ? true : false)">{{scope.row.level == 0 ? '授权' : '取消授权'}}</el-button>
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
      staffList: []
    }
  },
  created () {
    this.getStaff()
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
    handleApprove (row, isAdmin) {
      var that = this
      this.$axios.post('updatelevel/', {
        id: row.id,
        isAdmin: isAdmin
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '成功'
            })
            that.getStaff()
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '数据获取失败'
            })
          }
        })
    },
    getStaff () {
      var that = this
      this.$axios.get('stafflist/')
        .then(function (res) {
          if (res.data.status === 1) {
            that.staffList = res.data.data
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
