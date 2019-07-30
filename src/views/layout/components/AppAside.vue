<template>
  <!--
el-menu
  default-active指定默认激活的菜单项
  @open、@close展示和收起菜单项的时候会触发
  backgroound-color设置菜单栏的背景色
   active-text-color设置激活时的高亮颜色
   router是否使用 vue-router 的模式，
   启用该模式会在激活导航时以 index 作为 path 进行路由跳转
   el-submenu
    其中的eindex导航标识，可以用作路由导航路径，必须唯一，不然一样的都会受影响
  -->
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    router
    background-color="#545c64"
    text-color="#fff"
    active-text-color="orange"
  >
    <el-menu-item index="/">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>内容管理</span>
      </template>
      <el-menu-item index="/publish">
        <i class="el-icon-menu"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
       <el-menu-item index="1-2">
        <i class="el-icon-menu"></i>
        <span slot="title">内容列表</span>
      </el-menu-item>
       <el-menu-item index="1-3">
        <i class="el-icon-menu"></i>
        <span slot="title">评论列表</span>
      </el-menu-item>
       <el-menu-item index="1-4">
        <i class="el-icon-menu"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
    </el-submenu>

    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>粉丝管理</span>
      </template>
       <el-menu-item index="2-1">
        <i class="el-icon-menu"></i>
        <span slot="title">图文数据</span>
      </el-menu-item>
       <el-menu-item index="2-2">
        <i class="el-icon-menu"></i>
        <span slot="title">粉丝概况</span>
      </el-menu-item>
       <el-menu-item index="2-3">
        <i class="el-icon-menu"></i>
        <span slot="title">粉丝画像</span>
      </el-menu-item>
       <el-menu-item index="2-4">
        <i class="el-icon-menu"></i>
        <span slot="title">粉丝列表</span>
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="4">
      <i class="el-icon-setting"></i>
      <span slot="title">账户信息</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  data () {
    return {}
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang='less' scoped>
.el-menu {
  height: 100%;
}
.el-menu-item {

}
</style>
