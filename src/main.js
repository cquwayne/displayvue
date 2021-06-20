// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import api from './fetch/api'
import jsPlumb from 'jsplumb'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VCharts from 'v-charts'
import ModelFbx from 'vue-3d-model'
import NProgress from 'nprogress'
import XLSX from 'xlsx'

// 全局注册，使用方法为:this.$axios
Vue.prototype.api = api
Vue.prototype.$http = axios
Vue.prototype.$jsPlumb = jsPlumb.jsPlumb
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VCharts)
Vue.use(ModelFbx)
Vue.use(XLSX)

// 前置拦截，任何界面在进入之前都会被该函数拦截，直到next()被执行才会进入界面
router.beforeEach((to, from, next) => {
  NProgress.start()
  let args = [
    {url: 'system/all'},
    {url: 'system/tables'}
  ]
  if (store.state.baseTableMap === null || store.state.systemTable === null) {
    api.all(args).then(res => {
      console.log(res)
      store.commit('setBaseTableMap', res[0])
      store.commit('setSystemTable', res[1])
      next()
    })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
