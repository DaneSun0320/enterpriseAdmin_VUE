  <template>
    <el-row :gutter="30">
      <el-col :span="24">
        <el-card shadow="hover">
          <el-row type="flex"  justify="space-between">
            <div class="card-title">物资审批</div>
          </el-row>
          <el-row type="flex" >
            <el-table
              ref="filterTable"
              :data="application.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              style="width: 100%">
              <el-table-column
                prop="id"
                label="ID"
                sortable
                width="140"
              >
              </el-table-column>
              <el-table-column
                prop="goodName"
                label="名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="数量"
                width="140"
              >
              </el-table-column>
              <el-table-column
                prop="sectorName"
                label="申请部门"
                width="140"
              >
              </el-table-column>
              <el-table-column
                prop="applyTime"
                label="申请时间"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="approveTime"
                label="审批时间"
                width="150"
              >
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope" >
                  <div v-if="scope.row.status === 0">
                    <el-button
                      size="mini"
                      @click="approveApplication(scope.$index, scope.row, true)">通过</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="approveApplication(scope.$index, scope.row, false)">拒绝</el-button>
                  </div>
                  <div v-else>
                    <el-tag
                      :type="scope.row.status === 1 ? 'success' : 'danger'"
                      effect="dark">
                      {{ scope.row.status === 1 ? '已通过' : '已拒绝'}}
                    </el-tag>
                  </div>
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
      application: []
    }
  },
  created () {
    this.getApplication()
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
    getApplication () {
      var that = this
      this.$axios.get('application/')
        .then(function (res) {
          if (res.data.status === 1) {
            that.application = res.data.data
            that.total = res.data.data.length
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '物资数据获取失败'
            })
          }
        })
    },
    approveApplication (index, row, isApprove) {
      var that = this
      this.$axios.post('approvegoods/', {
        goodId: row.goodId,
        isApprove: isApprove
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '成功'
            })
            that.getApplication()
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '请求失败'
            })
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
