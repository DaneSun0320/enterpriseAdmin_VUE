import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import md5 from 'js-md5'

// 引入MD5
Vue.prototype.$md5 = md5
// 引入axios
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

axios.defaults.timeout = 15000
axios.defaults.baseURL = 'http://127.0.0.1:8000' // 本地端口和地址
axios.defaults.retry = 4
axios.defaults.retryDelay = 1000
axios.defaults.headers.Authorization = store.state.token
// 登录拦截器配置
var lock = false
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      lock = false
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是2开头的的情况
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  error => {
    if (error && error.stack.indexOf('timeout') > -1) { this.$message.error('请求超时，请检查服务程序状态！') }
    if (error.response.status === 401) {
      if (!lock) {
        Message.error('登录过期，请重新登录！')
        lock = true
      }
      store.state.token = null
      // 跳转至登录页面
      router.push('/login')
    } else if (error.response.status === 404) {
      Message.error('数据接口错误！')
    } else if (error.response.status === 406) {
      Message.error('权限不足，接口请求被拒绝！')
      store.state.level = 1
    } else if (error.response.status === 500) {
      Message.error('服务程序未启动！')
    }
  }
)
