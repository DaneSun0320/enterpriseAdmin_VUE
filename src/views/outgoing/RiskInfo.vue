<template>
  <div>
  <el-row :gutter="30">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-row type="flex"  justify="space-between">
          <div class="card-title">风险地区管理</div>
          <el-button type="primary" size="mini" @click="dialogVisible=true">添加</el-button>
        </el-row>
        <el-row type="flex">
          <el-table
            :data="infoList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%">
            <el-table-column
              label="序号"
              width="120">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="province"
              label="省"
              width="150"
              >
            </el-table-column>
            <el-table-column
              prop="city"
              label="市"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="district"
              label="区"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="riskLevel"
              label="风险等级"
              width="170"
              :filters="[{ text: '中风险', value: 1 }, { text: '高风险', value: 2 }]"
              :filter-method="filterTag"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.riskLevel === 1 ?'warning' : 'danger'"
                  disable-transitions>{{scope.row.riskLevel === 1 ?'中风险' : '高风险'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="250">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  style="margin-right: 10px;"
                  @click="levelModify(scope.row)">修改</el-button>
                    <el-popconfirm
                      title="确定删除该区域？"
                      @confirm="deleteRiskRegion(scope.row)"
                    >
                      <el-button
                        size="mini"
                        type="danger"
                        slot="reference">删除</el-button>
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
    <!----------------------------修改--------------------------------->
  <el-dialog
    title="修改风险等级"
    :visible.sync="riskDialogVisible"
    width="30%"
    :before-close="handleClose">
    <span>
      <template>
  <el-radio-group v-model="currentRegion.riskLevel">
    <el-radio :label = 1>中风险</el-radio>
    <el-radio :label = 2>高风险</el-radio>
  </el-radio-group>
</template>
    </span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="updateRiskLevel">确 定</el-button>
  </span>
  </el-dialog>
    <!-------------------------添加----------------------------------->
    <el-dialog
      title="添加风险地区"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
    <span>
      <el-form label-width="80px">
        <el-form-item label="风险区域">
          <el-cascader
            size="large"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
          >
        </el-cascader>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="riskLevel" placeholder="请选择">
            <el-option
              v-for="item in  [{
          value: 1,
          label: '中风险'
        }, {
          value: 2,
          label: '高风险'
        }]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
  </el-select>
        </el-form-item>
      </el-form>
    </span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submit">提交</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      options: regionData,
      selectedOptions: [],
      riskRegion: {
        province: '',
        city: '',
        district: ''
      },
      riskLevel: null,
      riskDialogVisible: false,
      dialogVisible: false,
      radio: 1,
      infoList: [],
      currentRegion: {
        id: null,
        riskLevel: null
      }
    }
  },
  created () {
    this.getRiskAreaInfo()
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
    submit () {
      var that = this
      this.$axios.post('addriskregion/', {
        province: that.riskRegion.province,
        city: that.riskRegion.city,
        district: that.riskRegion.district,
        level: that.riskLevel
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '添加成功'
            })
            that.getRiskAreaInfo()
          } else {
            that.$notify({
              type: 'error',
              title: '添加失败'
            })
          }
          this.getRiskAreaInfo()
        })
      this.handleClose()
    },
    deleteRiskRegion (row) {
      var that = this
      this.$axios.post('deleteriskregion/', {
        id: row.id
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '删除成功'
            })
            that.getRiskAreaInfo()
          } else {
            that.$notify({
              type: 'error',
              title: '删除失败'
            })
          }
        })
    },
    updateRiskLevel () {
      var that = this
      this.$axios.post(that.currentRegion.riskLevel === 0 ? 'deleteriskregion/' : 'updateriskLevel/', {
        id: that.currentRegion.id,
        riskLevel: that.currentRegion.riskLevel
      })
        .then(function (res) {
          if (res.data.status === 1) {
            that.$notify({
              type: 'success',
              title: '修改成功'
            })
            that.getRiskAreaInfo()
          } else {
            that.$notify({
              type: 'error',
              title: '修改失败'
            })
          }
        })
      that.riskDialogVisible = false
    },
    handleChange () {
      console.log(this.selectedOptions)
      var loc = []
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc.push(CodeToText[this.selectedOptions[i]])
      }
      this.riskRegion.province = loc[0]
      this.riskRegion.city = loc[1]
      this.riskRegion.district = loc[2]
    },
    levelModify (row) {
      this.currentRegion.id = row.id
      this.currentRegion.riskLevel = row.riskLevel
      this.riskDialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
      this.riskDialogVisible = false
      this.riskRegion = {
        province: '',
        city: '',
        district: ''
      }
      this.selectedOptions = []
      this.riskLevel = null
    },
    filterTag (value, row) {
      return row.riskLevel === value
    },
    getRiskAreaInfo () {
      var that = this
      this.$axios.get('riskregion/')
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
