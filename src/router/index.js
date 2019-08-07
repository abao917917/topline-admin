import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   component: () => import('@/views/home')
    // },
    {
      name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [// 所有children路由都显示到父路由的router-view中
        {
          name: 'home',
          path: '', // 它就是layout的默认子路由
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }

  ]
})
// 所有路由导航都要经过这里，
// to：Router 即将进入的目标路由对象；
// from ：Router 当前导航正要离开的路由；
// next：Function  调用此方法来resovle执行这个钩子，执行效果要靠next方法中的参数；
router.beforeEach((to, from, next) => {
  // 如果是非/login页面，判断其登录状态,可以用路由的name判断，console.log(to)打印出来有name项
  // 但是防止组件没有名字，用path判断更保险；
  /** 设置导航拦截的判断思路——
   *  1.如果非登录页面分两种情况：
   *     ① 如果非登录页，没有登录信息，直接拦截跳转到登录页；
   *     ② 如果非登录页，但是登录了，则允许点击跳到任何页面
   *  2.如果是登录页面分两种情况：
   *     ①已经登录了，阻断跳转到登录页， 不允许访问登录页
   *     ②没有登录，才允许访问登录页
   */
  nprogress.start()
  const userInfo = window.localStorage.getItem('user_info')
  if (to.path !== '/login') {
    if (!userInfo) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else { // 此处全写应是 else(to path =='/login')
    if (userInfo) {
      next(false)
      /* next(false): 中断当前的导航,终止访问to path =='/login'登录页
      如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，
      那么 URL 地址会重置到 from 路由对应的地址 */
    } else {
      next()
    }
  }
})

// 路由导航完成的时候会进入这里
router.afterEach((to, from) => {
  nprogress.done()
})
export default router
