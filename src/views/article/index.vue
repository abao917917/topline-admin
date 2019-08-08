<template>
  <div>
    <!--筛选区域-->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动形式">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--/筛选区域-->
    <!--列表区域-->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>共找到15条符合条件的内容</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <!--table表格-->
      <!--data用来指定表格的数据，表格不需要我们自己手动遍历，
      只需要把数据给el-table的data属性就可以了，
      然后配置el-table-column需要展示的数据字段即可；
      -->
      <el-table
      class="list-table"
      :data="articles"
      style="width: 100%"
      v-loading="articleLoading" >
      <!--当articleLoading为true时，便执行禁用转圈圈动效v-loading-->
        <el-table-column
        prop="cover.images[0]"
        label="封面"
        width="60">
        <!--表格列默认只能输出文本，如果需要自定义里面的内容，则需要用template,
        slot-scope是插槽作用域，现在先听个名词，你要知道的是值scope是起的一个名字，
        scope中有个成员叫row,scope.row就是当前的便利项对象
        -->
        <template slot-scope="scope">
          <img width="30"  :src="scope.row.cover.images[0]" alt="">
        </template>
        </el-table-column>
        <el-table-column
        prop="title"
        label="标题"
        width="180"></el-table-column>
        <el-table-column
        prop="pubdate"
        label="发布日期"
        width="180"></el-table-column>
        <el-table-column
        prop="status"
         label="状态"></el-table-column>
      </el-table>
      <!--/table表格-->
      <el-pagination
      background layout="prev, pager, next"
      :total="totalCount"
      :disabled="articleLoading"
      @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>
    <!--/列表区域-->
  </div>
</template>

<script>
// const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [], // 列表数据
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        value1: ''
      },
      totalCount: 0,
      articleLoading: false
    }
  },
  // 请求文章列表，需要在userInfo中取出token令牌；
  created () {
    this.loadArticles()
  },
  methods: {
    loadArticles (page = 1) { // ES6默认语法，函数的默认值，传了才会是传的参数
      this.articleLoading = true
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page, // 请求数据的页码，不传默认为1
          per_page: 10 // 请求数据的每页大小，不传默认为10
        }
      }).then(data => {
        this.articles = data.results // 返回的列表数据
        this.totalCount = data.total_count // 文章列表条数总记录数
        this.articleLoading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    handleCurrentChange (page) {
      // 当页码发生改变的时候，请求该页码对用的数据
      this.loadArticles(page)
    }

  }
}
</script>

<style lang='less' scoped>
.filter-card {
  margin-bottom: 20px;
  .list-table {
    margin-bottom: 30px;
  }
}
</style>
