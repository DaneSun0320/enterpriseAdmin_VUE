<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo menu-text"
    :unique-opened="true"
    router
  >
    <span v-for="item in menu" :key="item.path">
       <el-menu-item v-if="item.children.length === 0" :index="item.path" :disabled="$store.state.level < 2&&item.superAdmin">
          <i :class="item.icon"></i>
          <span>{{item.name}}</span>
       </el-menu-item>
       <el-submenu  v-else  :index="item.path" :disabled="$store.state.level < 2&&item.superAdmin">
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{item.name}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item  v-for="i in item.children" :key="i.path" :index="item.path+i.path" :disabled="$store.state.level < 2&&i.superAdmin">{{i.name}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    </span>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
      menu: [
        {
          path: '/',
          name: '总览',
          icon: 'el-icon-monitor',
          superAdmin: false,
          children: []
        },
        {
          path: '/daily',
          name: '日常打卡',
          icon: 'el-icon-map-location',
          superAdmin: false,
          children: [
            {
              path: '/today',
              name: '今日打卡'
            },
            {
              path: '/all',
              name: '打卡明细'
            }
          ]
        },
        {
          path: '/goods',
          name: '防疫物资管理',
          icon: 'el-icon-truck',
          superAdmin: false,
          children: [
            {
              path: '/data',
              name: '物资明细'
            },
            {
              path: '/add',
              name: '物资录入'
            },
            {
              path: '/approval',
              name: '物资审批',
              superAdmin: true
            }
          ]
        },
        {
          path: '/outgoing',
          name: '异地员工管理',
          icon: 'el-icon-position',
          superAdmin: false,
          children: [
            {
              path: '/data',
              name: '异地员工信息'
            },
            {
              path: '/approval',
              name: '员工出差审批'
            },
            {
              path: '/risk',
              name: '风险地区管理'
            }
          ]
        },
        {
          path: '/sector',
          name: '部门管理',
          icon: 'el-icon-office-building',
          superAdmin: true,
          children: []
        },
        {
          path: '/staff',
          name: '员工管理',
          icon: 'el-icon-user',
          superAdmin: false,
          children: [
            {
              path: '/data',
              name: '员工信息'
            },
            {
              path: '/add',
              name: '员工录入'
            },
            {
              path: '/card',
              name: '员工卡管理'
            }
          ]
        },
        {
          path: '/system',
          name: '授权管理',
          icon: 'el-icon-key',
          superAdmin: true,
          children: []
        }
      ]
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .menu-text {
    font-weight: bold;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    height:100%;
    min-height: 95vh;
    border-right: solid 0px;
  }
</style>
