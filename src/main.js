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
 * 也就是说配置了这个东西，就不用没戏都写长长的http://xxx
 * 只需要写例如axios({url:'/authorizations'})
 */
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 往Vue原型对象中添加成员，尽量使用 $名字 起名字，目的是为了防止和组件中的成员冲突
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
