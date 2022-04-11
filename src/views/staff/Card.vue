<template>
  <span>
  <el-row :gutter="30">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">员工卡管理</div>
        </el-row>
        <el-row type="flex">
          <el-table
            ref="filterTable"
            :data="staffList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%">
            <el-table-column
              label="序号"
              width="180">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="uid"
              label="员工卡号"
              width="200">
            </el-table-column>
            <el-table-column
              prop="sectorName"
              label="部门"
              width="180">
            </el-table-column>
            <el-table-column
              label="操作"
              width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="writeCard(scope.row)">录入/修改</el-button>
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
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="closeDialog"
  >
    <div v-show="status === null">
    <div  style="display: flex;justify-content:center;margin: 10px;">
      <div class="preload-5"></div>
    </div>
    <div style="margin-top: 40px;font-weight: bold;font-size: 18px;">等待读卡中...</div>
    </div>
    <div v-show="status !== null">
      <el-result :icon="resultIcon" :title="resultTitle" :subTitle="subTitle">
        <template slot="extra">
        <el-button type="primary" size="medium" @click="closeDialog">关闭</el-button>
      </template>
    </el-result>
    </div>
  </el-dialog>
  </span>
</template>>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      staffList: [],
      dialogVisible: false,
      status: null,
      source: null
    }
  },
  created () {
    this.getSector()
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
    getSector () {
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
    },
    closeDialog () {
      this.dialogVisible = false
      this.getSector()
      var that = this
      setTimeout(function () {
        that.status = null
      }, 500)
    },
    writeCard (row) {
      var that = this
      that.dialogVisible = true

      // 取消上一次请求
      this.cancelRequest()
      this.$axios.post('writecard/', {
        id: row.id
      }, {
        headers: {
          Accept: 'application/json'
        },
        cancelToken: new that.$axios.CancelToken(function executor (c) {
          that.source = c
        }
        )
      })
        .then(function (res) {
          that.status = res.data.status
          console.log(that.status)
        })
        .catch((err) => {
          if (that.$axios.isCancel(err)) {
            console.log('Rquest canceled', err.message) // 请求如果被取消，这里是返回取消的message
          } else {
            // handle error
            console.log(err)
          }
        })
    },
    cancelRequest () {
      if (typeof this.source === 'function') {
        this.source('终止请求')
      }
    }
  },
  computed: {
    resultIcon () {
      if (this.status === 1) return 'success'
      else if (this.status === -1) return 'error'
      else return 'warning'
    },
    resultTitle () {
      if (this.status === 1) return '读卡成功'
      else if (this.status === -1) return '设备未连接'
      else if (this.status === -2) return '读卡超时'
      else return '未读到卡信息'
    },
    subTitle () {
      if (this.status === 1) return ''
      else if (this.status === -1) return '请检查设备及网络是否连接'
      else if (this.status === -2) return '请在10s内完成读卡操作'
      else return ''
    }
  }
}
</script>

<style scoped>
  .el-card {
    border-radius: 15px;
  }
  .el-dialog{
    border-radius: 15px;
  }
  .el-row{
    margin-bottom: 20px;
  }
  .preload-5 {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #91c4f9;
    -webkit-animation: preload-5 1.5s infinite linear;
    animation: preload-5 1.5s infinite linear;
  }
  .preload-5:after {
    content: '';
    position: absolute;
    width: 80px;
    height: 80px;
    border-top: 10px solid #3a8ee6;
    border-bottom: 10px solid #3a8ee6;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-radius: 50%;
    top: -20px;
    left: -20px;
  }

  @-webkit-keyframes preload-5 {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    50% {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes preload-5 {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    50% {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
