<template>
  <el-row :gutter="30">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">员工出差审批</div>
        </el-row>
        <el-row type="flex" >
          <el-table
            :data="infoList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%">
            <el-table-column
              label="序号"
              width="60">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="90">
            </el-table-column>
            <el-table-column
              prop="sectorName"
              label="部门"
              width="90">
            </el-table-column>
            <el-table-column
              label="出差地"
              width="160">
              <template slot-scope="scope">
                {{scope.row.province + " " + scope.row.city + " " + scope.row.district}}
              </template>
            </el-table-column>
            <el-table-column
              prop="startDate"
              label="起始日期"
              width="100">
            </el-table-column>
            <el-table-column
              prop="endDate"
              label="结束日期"
              width="100">
            </el-table-column>
            <el-table-column
              prop="applyDate"
              label="申请时间"
              width="120">
            </el-table-column>
            <el-table-column
              prop="status"
              label="风险等级"
              width="80">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 0 ? 'success' : scope.row.status === 1 ?'warning' : 'danger'"
                  disable-transitions>{{scope.row.status === 0 ? '低风险' : scope.row.status === 1 ?'中风险' : '高风险'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="approveStatus"
              label="审核状态"
              :filters="[{ text: '待审核', value: 0 }, { text: '通过', value: 1 }, { text: '拒绝', value: -1 }]"
              :filter-method="filterTag"
              filter-placement="bottom-end"
              width="180">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.approveStatus === 0"
                  :disabled="$store.state.level < 2 && scope.row.sectorId !== $store.state.sectorId"
                  size="mini"
                  @click="handleApprove(scope.row,true)">通过</el-button>
                <el-button
                  v-if="scope.row.approveStatus === 0"
                  :disabled="$store.state.level < 2 && scope.row.sectorId !== $store.state.sectorId"
                  size="mini"
                  type="danger"
                  @click="handleApprove(scope.row,false)">拒绝</el-button>
                <el-tag
                  v-if="scope.row.approveStatus !== 0"
                  :type="scope.row.approveStatus === 1 ? 'success' : 'danger'"
                  disable-transitions>{{scope.row.approveStatus === 1 ? '通过' : '拒绝'}}</el-tag>
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
    handleApprove (row, isApprove) {
      var that = this
      that.$axios.post('outsideapprove/', {
        id: row.id,
        isApprove: isApprove
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '成功'
            })
            that.getOutsideInfo()
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '请求异常'
            })
          }
        })
    },
    filterTag (value, row) {
      return row.approveStatus === value
    },
    getOutsideInfo () {
      var that = this
      this.$axios.get('outsideinfoforapprove/')
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
