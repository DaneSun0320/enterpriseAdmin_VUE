<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="24">
        <el-card shadow="hover">
          <el-row type="flex" justify="space-between">
            <div class="card-title">
              员工信息
            </div>
          </el-row>
          <el-row type="flex">
            <el-table ref="filterTable" :data="staffList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
              <el-table-column label="序号" width="60">
                <template slot-scope="scope">
                  {{scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="80">
              </el-table-column>
              <el-table-column label="性别" width="60">
                <template slot-scope="scope">
                  {{scope.row.sex === 0 ? '女' : '男'}}
                </template>
              </el-table-column>
              <el-table-column prop="age" label="年龄" width="60">
              </el-table-column>
              <el-table-column prop="phone" label="联系电话" width="110">
              </el-table-column>
              <el-table-column prop="email" label="电子邮箱" width="180">
              </el-table-column>
              <el-table-column prop="sectorName" label="部门" width="70">
              </el-table-column>
              <el-table-column prop="position" label="职位" width="70">
              </el-table-column>
              <el-table-column prop="level" label="系统权限" effect="plain" width="110">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.level === 0 ? 'info' : scope.row.status === 1 ?'success' : ''" disable-transitions="">
                    {{scope.row.level === 0 ? '无权限' : scope.row.level === 1 ?'子管理员' : '超级管理员'}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" :disabled="canModify(scope.row)" @click="handleEdit(scope.row)">
                    修改
                  </el-button>
                  <el-popconfirm style="margin-left: 10px;" title="确定要删除该员工么" @confirm="handleDelete(scope.row)">
                    <el-button size="mini" type="danger" slot="reference" :disabled="canDelete(scope.row)">
                      删除
                    </el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[1, 2, 5, 50]" :page-size="pageSize" layout="prev, pager, next" :total="parseInt(total)" background="" style="margin-top: 10px;">
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="修改信息" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
     <span>
      <el-form ref="form" :model="current" label-width="100px">
       <el-form-item label="姓名">
        <el-input v-model="current.name"></el-input>
       </el-form-item>
       <el-form-item label="性别">
        <el-select style="display: flex" v-model="current.sex" placeholder="请选择">
         <el-option label="男" :value="true"></el-option>
         <el-option label="女" :value="false"></el-option>
        </el-select>
       </el-form-item>
       <el-form-item label="年龄">
        <el-input v-model.number="current.age"></el-input>
       </el-form-item>
       <el-form-item label="联系电话" prop="phone">
        <el-input v-model.number="current.phone"></el-input>
       </el-form-item>
       <el-form-item prop="email" label="邮箱">
        <el-input v-model="current.email"></el-input>
       </el-form-item>
       <el-form-item label="部门">
        <el-select style="display: flex" v-model="current.sectorName" placeholder="请选择">
         <el-option v-for="item in sector" :key="item.id" :label="item.name" :value="item.id">
          <span>{{ item.name }}</span>
         </el-option>
        </el-select>
       </el-form-item>
       <el-form-item label="职位" prop="name">
        <el-input v-model="current.position"></el-input>
       </el-form-item>
      </el-form> </span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">
       取 消
      </el-button>
      <el-button type="primary" @click="handleClose">
       确 定
      </el-button> </span>
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
      current: {
        id: null,
        name: '',
        sex: null,
        age: null,
        phone: '',
        email: '',
        sector: null,
        sectorName: '',
        position: null
      },
      dialogVisible: false,
      staffList: [],
      sector: []
    }
  },
  created () {
    this.getStaff()
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
    submitUpdate () {
      if (!isNaN(this.current.sectorName)) {
        // 部门被用户修改
        this.current.sector = this.current.sectorName
      }
      var that = this
      this.$axios.post('updatestaff/', {
        id: that.current.id,
        name: that.current.name,
        sex: that.current.sex,
        age: that.current.age,
        phone: that.current.phone,
        email: that.current.email,
        sector: that.current.sector,
        position: that.current.position
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '更新成功'
            })
            that.getStaff()
          } else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '更新失败'
            })
          }
        })
      this.dialogVisible = false
    },
    handleEdit (row) {
      this.current.id = row.id
      this.current.name = row.name
      this.current.sector = row.sector
      this.current.sex = row.sex
      this.current.age = row.age
      this.current.email = row.email
      this.current.phone = row.phone
      this.current.position = row.position
      this.current.sectorName = row.sectorName
      this.dialogVisible = true
    },
    handleClose () {
      this.current = {
        id: null,
        name: '',
        sex: null,
        age: null,
        phone: '',
        email: '',
        sector: null,
        sectorName: '',
        position: null
      }
      this.dialogVisible = false
    },
    handleDelete (row) {
      var that = this
      this.$axios.post('deletestaff/', {
        id: row.id
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '删除成功'
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
    getSector () {
      var that = this
      this.$axios.get('sectorlist/')
        .then(function (res) {
          if (res.data.status === 1) that.sector = res.data.data
          else {
            that.$notify({
              type: 'error',
              title: '失败',
              message: '部门数据获取失败'
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
    },
    canModify (row) {
      if (this.$store.state.staffId !== row.id) {
        if (this.$store.state.sectorId !== row.sector && this.$store.state.level > 0) {
          // 如果不是本部门，看管理员等级
          if (this.$store.state.level === 2) return false
          else return true
        } else return true
      } else return false
    },
    canDelete (row) {
      if (this.$store.state.staffId === row.id) return true
      else {
        if (this.$store.state.level > 0) {
          if (this.$store.state.level === 2) return false
          else {
            if (this.$store.state.sectorId === row.sector) return false
            else return true
          }
        } else return true
      }
    }
  }
}
</script>
<style scoped="">
  .el-card {
    border-radius: 15px;
  }
  .el-row{
    margin-bottom: 20px;
  }
</style>
