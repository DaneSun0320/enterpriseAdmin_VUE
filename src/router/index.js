import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/apply',
    name: '申请',
    component: () => import('../views/Apply')
  },
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: '/',
        name: '总览',
        component: () => import('../views/attendance/Index.vue')
      },
      {
        path: '/daily/all',
        name: '打卡明细',
        component: () => import('../views/attendance/All.vue')
      },
      {
        path: '/daily/today',
        name: '今日打卡',
        component: () => import('../views/attendance/Today.vue')
      },
      {
        path: '/goods/data',
        name: '防疫物资管理',
        component: () => import('../views/goods/Goods.vue')
      },
      {
        path: '/goods/add',
        name: '物资录入',
        component: () => import('../views/goods/addGoods.vue')
      },
      {
        path: '/goods/approval',
        name: '物资申请',
        component: () => import('../views/goods/approvalGoods.vue')
      },
      {
        path: '/outgoing/data',
        name: '异地出差管理',
        component: () => import('../views/outgoing/Outgoing.vue')
      },
      {
        path: '/outgoing/approval',
        name: '出差审批',
        component: () => import('../views/outgoing/Approval.vue')
      },
      {
        path: '/outgoing/risk',
        name: '风险地区管理',
        component: () => import('../views/outgoing/RiskInfo.vue')
      },
      {
        path: '/sector',
        name: '部门管理',
        component: () => import('../views/sector/Sector.vue')
      },
      {
        path: '/staff/data',
        name: '员工管理',
        component: () => import('../views/staff/Staff.vue')
      },
      {
        path: '/staff/add',
        name: '员工录入',
        component: () => import('../views/staff/Add.vue')
      },
      {
        path: '/staff/card',
        name: '员工卡管理',
        component: () => import('../views/staff/Card.vue')
      },
      {
        path: '/system',
        name: '系统管理',
        component: () => import('../views/system/System.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
