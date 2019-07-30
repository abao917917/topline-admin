<template>
  <div>
    <el-row class="app-header">
      <el-col :span="14">江苏传智播客教育科技股份有限公司</el-col>
      <el-col :span="10" :offset="6">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <img width="25" :src="userInfo.photo" />
            {{userInfo.name}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>git地址</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  }
}
</script>

<style lang='less' scoped>
.app-header {
  display: flex;
  align-items: center;
  height: 60px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
