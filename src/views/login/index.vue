<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条" />
      </div>
      <div class="login-form">
        <!-- 表单验证：
        rules配置验证规则;
        ref获取表单组件，可以手动调用表单组件的验证方法;-->
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <!-- 支持栅格布局，一共24列 -->
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="handleSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button
              class="btn-login"
              type="primary"
              @click="handleLogin"
              :loading="loginLoading"
            >登录</el-button>
          </el-form-item>
            <el-form-item prop="agree">
          <!-- `checked` 为 true 或 false -->
          <el-checkbox v-model="form.agree" class="login-checkbox"></el-checkbox>
          <span>我已阅读并同意 <a href="#">用户协议</a> 和 <a href="#">隐私条款</a></span>
            </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'
export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '13683109553',
        code: '',
        agree: '' // 是否同意用户协议
      },
      loginLoading: false, // 登录按钮loading状态默认是false不禁用
      // 配置各种验证规则
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '长度必须是11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度必须为6个字符', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          // 表单验证部分，表单里的验证规则
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]

      },
      captchaObj: null // 通过initGeetest得到极验验证码对象
    }
  },
  methods: {
    // 请求登录接口
    handleLogin () {
      // 表单组件有一个方法validate可以用于获取当前表单的验证状态
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过，可以发请求登录了
        this.submitlogin()
      })
    },
    // 这里是封装了axios发送的登录请求，必须判断表单验证通过了，再调用这个发请求登录
    submitlogin () {
      this.loginLoading = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      })
        .then(res => {
          // >=200&&<400的状态码（then代表成功）都会进入这里
          // console.log(res.data)
          // Element提供的Message消息提示组件
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.loginLoading = false
          this.$router.push({
            // 建议路由跳转都使用路由name去跳转，路由传参非常方便
            name: 'home'
          })
        })
        .catch(error => {
          // console.log(error)
          if (error.response.status === 400) {
            this.$message.error('登录失败，手机号或验证码错误')
          }
          this.loginLoading = false
        })
    },
    // 点击发送验证码按钮的事件处理程序
    handleSendCode () {
      // 校验手机号码是否有效，有效才会人机交互验证
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        // 手机号码验证判断，正确后才能显示人机交互
        if (errorMessage.trim().length > 0) {
          return
        }
        this.showGeetest()
      })
    },
    showGeetest () {
      // ①取出文本框对象中的号码
      const { mobile } = this.form
      // ②当product参数为bind时，可以调用极验验证接口
      if (this.captchaObj) {
        return this.captchaObj.verify()
      }
      // ③发送请求
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
        // url: `http://toutiao.course.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // console.log(res.data)
        // 返回的数据为res.data,取出res.data中的data对象
        const data = res.data.data
        // 极验初始化
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind'
          },
          //
          captchaObj => {
            this.captchaObj = captchaObj
            // 这里可以调用验证实例 captchaObj 的实例方法
            captchaObj
              .onReady(function () {
                // 验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify()
              })
              .onSuccess(function () {
                // console.log(captchaObj.getValidate())
                const {
                  // 解构赋值取出后，接口中重名取的别名
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate()
                // getValidate方法 获取用户进行成功验证(onSuccess)所得到的结果，该结果用于进行服务端 SDK 进行二次验证。
                axios({
                  method: 'GET',
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`,
                  parmas: {
                    // axios发get请求时，专门用来传递query查询字符串参数
                    challenge,
                    seccode,
                    validate
                  }
                }).then(res => {
                  console.log(res.data)
                })
              })
          }
        )
      })
    }
  }
}
</script>
<style lang='less' scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  background: url(./login_bg.jpg) no-repeat;
  background-size: cover;
  .login-head {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  .login-form-wrap {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  .login-checkbox {
    margin-right: 10px;
  }
  span {
      color: #666;
    }
  }
}
</style>
