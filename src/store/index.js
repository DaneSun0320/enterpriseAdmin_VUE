import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: window.sessionStorage.getItem('name') ? window.sessionStorage.getItem('name') : '',
    staffId: window.sessionStorage.getItem('staffId') ? parseInt(window.sessionStorage.getItem('staffId')) : null,
    sectorId: window.sessionStorage.getItem('sectorId') ? parseInt(window.sessionStorage.getItem('sectorId')) : null,
    level: window.sessionStorage.getItem('level') ? parseInt(window.sessionStorage.getItem('level')) : 0,
    token: window.sessionStorage.getItem('token') ? window.sessionStorage.getItem('token') : ''
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
