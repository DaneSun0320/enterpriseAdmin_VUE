<template>
  <div>
  <el-row :gutter="30">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">物资明细</div>
        </el-row>
        <el-row type="flex" >
          <el-table
            ref="filterTable"
            :data="goods.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="ID"
              sortable
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="160">
            </el-table-column>
            <el-table-column
              prop="specification"
              label="规格"
              width="140"
            >
            </el-table-column>
            <el-table-column
              prop="amount"
              label="数量"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="operator"
              label="经手人"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="update_time"
              label="库存更新时间"
              width="150"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  style="margin-right: 10px"
                  size="mini"
                  @click="handleApply(scope.$index, scope.row)">物资申请</el-button>
                <el-popconfirm
                  title="确定删除该物资信息吗？"
                  @confirm="handleDelete(scope.$index,scope.row)"
                >
                  <el-button
                    slot="reference"
                    size="mini"
                    type="danger"
                    >删除</el-button>
                </el-popconfirm>
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
    <el-dialog
      title="申请物资"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
    <span>
      <el-form ref="form" label-width="80px">
        <el-form-item label="申请数量">
          <el-input-number v-model="data.num"  :min="1" :max="data.amount" ></el-input-number>
        </el-form-item>
      </el-form>
    </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="applyApplication">确 定</el-button>
    </span>
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
      dialogVisible: false,
      goods: [],
      data: {
        id: null,
        amount: 0,
        num: 1
      }
    }
  },
  created () {
    this.getGood()
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
    applyApplication: function () {
      var that = this
      this.$axios.post('applygoods/', {
        id: that.data.id,
        amount: that.data.num,
        sectorId: that.$store.state.sectorId
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '申请成功'
            })
          } else if (res.data.status === -1) {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '您申请的物资数量超过您可申请的最大数量！(最高10%)'
            })
          } else if (res.data.status === 2) {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '您对该物资曾有未批复的申请，请等待批复'
            })
          } else if (res.data.status === -1) {
            that.$notify({
              type: 'error',
              title: '错误',
              message: '申请失败'
            })
          }
        })
      this.data = {
        id: null,
        amount: 0,
        num: 1
      }
      this.dialogVisible = false
    },
    handleClose: function (done) {
      this.data = {
        id: null,
        amount: 0,
        num: 1
      }
      done()
    },
    handleApply: function (index, row) {
      this.dialogVisible = true
      this.data.id = row.id
      this.data.amount = row.amount
    },
    handleDelete: function (index, row) {
      var that = this
      that.$axios.post('deletegoods/', {
        id: row.id
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '删除成功'
            })
            that.goods.splice(index, 1)
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '删除失败'
            })
          }
        })
    },
    getGood: function () {
      var that = this
      this.$axios.get('/goods')
        .then(function (res) {
          if (res.data.status === 1) {
            that.goods = res.data.data
            that.total = res.data.data.length
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '物资数据获取失败'
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
