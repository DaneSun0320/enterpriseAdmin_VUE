<template>
  <span>
    <el-dialog title="添加部门" :visible.sync="dialogVisible" :before-close="dialogClose">
      <el-form ref="form" :model="name" label-width="80px">
        <el-form-item label="部门名称">
          <el-input v-model="name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 0px;" type="primary" @click="addSector">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  <el-row :gutter="30">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">部门信息</div>
          <el-button type="primary" size="mini" @click="dialogVisible = true">添加</el-button>
        </el-row>
        <el-row type="flex" >
          <el-table
            ref="filterTable"
            :data="sectorList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%">
            <el-table-column
              label="序号">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope" >
                  <el-popconfirm
                    title="确定删除该部门？"
                  >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteSector(scope.row)"
                      slot="reference"
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
  </span>
</template>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      name: '',
      dialogVisible: false,
      sectorList: []
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
    dialogClose () {
      this.name = ''
      this.dialogVisible = false
    },
    deleteSector (row) {
      var that = this
      that.$axios.post('deletesectorlist/', {
        id: row.id
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '删除成功'
            })
            that.getSector()
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '删除失败'
            })
          }
        })
    },
    addSector () {
      var that = this
      that.$axios.post('addsectorlist/', {
        name: that.name
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '添加成功'
            })
            that.dialogClose()
            that.getSector()
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '添加失败'
            })
          }
        })
    },
    getSector () {
      var that = this
      this.$axios.get('sectorlist/')
        .then(function (res) {
          if (res.data.status === 1) {
            that.sectorList = res.data.data
            that.toatal = res.data.data
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
