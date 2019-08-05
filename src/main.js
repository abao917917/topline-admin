import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// 优先查找文件，如果文件找不到则找目录
// 优先找到目录，优先加载目录中的index.js
import router from './router'

import './styles/index.less'
import 'nprogress/nprogress.css'
/**
 * 配置axios的基础路由
 * 也就是说配置了这个东西，就不用每次都写长长的http://xxx
 * 只需要写例如axios({url:'/authorizations'})
 */
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 往Vue原型对象中添加成员，尽量使用 $名字 起名字，目的是为了防止和组件中的成员冲突
// Axios请求拦截器
// 所有使用axios发起的请求都要先经过这里
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  console.log('有请求经过了')
  console.log(config)
  // return  config就是允许通过的方式
  // configs是本次请求相关的配置对象,打印出来是一个对象，在对象headers中加入token令牌；
  config.headers.Authorization = `Bearer ${userInfo.token}`
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
})
// Axios响应拦截器
axios.interceptors.response.use(response => {
  // Do something with response data
  return response
}, error => {
  // Do something with response error
  return Promise.reject(error)
})
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
