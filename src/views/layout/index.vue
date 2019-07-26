<template>
<el-container>
  <el-aside width="200px">Aside</el-aside>
  <el-container>
    <el-header>Header</el-header>
    <el-main>Main</el-main>
  </el-container>
</el-container>
<!--<div>
  <AppHeader/>
  <AppAside/>
 这里的内容是除了固定头和框之外的动态部分，home、发布文章、评论管理等
</div> -->
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  name: 'AppLayout',
  components: {
    // eslint-disable-next-line
    AppAside,
    // eslint-disable-next-line
    AppHeader
  },
  data () {
    return {}
  }
}
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background: #d0dce7;
}
.el-header {
  background: #aec0d1;
}
.el-main {
  background: #e8eff4;
}
</style>
