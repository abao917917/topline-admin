import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import JSONbig from 'json-bigint'
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
// 使用JSONbig处理返回数据中超出javascript安全整数范围的数字
// JSON自己会分析数据中的哪个数字超出了安全整数范围
// 后端的数据id超出了javascript的安全整数范围，会导致整数无法精确表示
// 可以使用json-bigint来处理，它会帮你把超出js安全范围的数字处理好
axios.defaults.transformResponse = [function (data) {
  return JSONbig.parse(data)
}]
// 往Vue原型对象中添加成员，尽量使用 $名字 起名字，目的是为了防止和组件中的成员冲突
// Axios请求拦截器
// 所有使用axios发起的请求都要先经过这里
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  // 如果登录了，才给那些除此之外的接口添加token令牌；
  if (userInfo) {
    // config是本次请求相关的配置对象,打印出来是一个对象，在对象headers中加入token令牌；
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  // return  config就是允许通过的方式
  return config
}, error => {
  return Promise.reject(error)
})
// Axios响应拦截器
axios.interceptors.response.use(response => { // >=200&<400
  // console.log('response=>', response)
  return response.data.data
},
error => { // >=400的状态码会进入这里
  const status = error.response.status
  if (status === 401) {
    // 务必删除本地存储中的用户信息数据，才能实现跳转回登录页
    window.localStorage.removeItem('user_info')
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
