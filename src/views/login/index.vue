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
              <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
              <el-button
                @click="handleSendCode "
                :disabled="!!codeTimer||codeLoading"
              >{{codeTimer ? `剩余${codeSecons}秒`:'获取验证码'}}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <!-- `checked` 为 true 或 false -->
            <el-checkbox v-model="form.agree" class="login-checkbox"></el-checkbox>
            <span>
              我已阅读并同意
              <a href="#">用户协议</a> 和
              <a href="#">隐私条款</a>
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              class="btn-login"
              type="primary"
              @click="handleLogin"
              :loading="loginLoading"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'
const initCodeSeconds = 10
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
      captchaObj: null, // 通过initGeetest得到极验验证码对象
      codeSecons: initCodeSeconds, // 倒计时的时间
      codeTimer: null, // 倒计时定时器
      sendMobile: '', // 保存第一次点击后，初始化验证码之后的手机号
      codeLoading: false
    }
  },
  methods: {
    // 点击登录按钮，进行表单验证
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
    // 点击获取验证码按钮的事件处理程序
    handleSendCode () {
      // ①校验手机号码是否有效，有效才会人机交互验证
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        // 手机号码验证判断，正确后才能显示人机交互
        if (errorMessage.trim().length > 0) {
          return
        }

        // ②判断是否有验证码插件对象
        if (this.captchaObj) {
        // 判断刷新後是不是更换了新号码
        // 如果用户输入的手机号和之前初始化的验证码手机号不一致，就基于当前手机号码重新初始化；
          // 否则，手机号就是和之前输入的一样，直接verify显示；
          if (this.form.mobile !== this.sendMobile) {
            // 处理掉验证码插件产生的旧的dom
            document.body.removeChild(document.querySelector('.geetest_panel'))
            // 重新初始化验证码插件
            this.showGeetest()
          } else {
            // 和之前号码一致，直接调用verify显示；
            this.captchaObj.verify()
          }
        } else {
          // 这里是第1次初始化验证码插件
          this.showGeetest()
        }
      })
    },
    // 调用极验，开启人机验证，发送短信
    showGeetest () {
      // 初始化验证码期间，禁用按钮的点击状态
      this.codeLoading = true
      // ①取出文本框对象中的号码
      const { mobile } = this.form

      // ③发送请求,请求线上接口
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${this.form.mobile}`
        // url: `http://toutiao.course.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // console.log(res.data)
        // 返回的数据为res.data,取出res.data中的data对象
        const data = res.data.data
        // 极验初始化
        // 使用初始化函数 initGeetest 初始化后，它的第二个参数是一个回调，回调的第一个参数即是验证实例
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind'
          },
          // 极验验证实例
          captchaObj => {
            this.captchaObj = captchaObj
            // 这里可以调用验证实例 captchaObj 的实例方法
            captchaObj.onReady(() => {
              // 验证码ready之后才能调用verify方法显示验证码
              // 记录曾经点击过发送验证码按钮，初始化过的手机号码
              this.sendMobile = this.form.mobile
              captchaObj.verify()
              // 验证码初始化好了，让‘获取验证码按钮’可点击
              this.codeLoading = false
            })
              .onSuccess(() => { // function定义的普通函数this指向window,并不指向vue实例所以此处函数要改成箭头函数，this指向外层指向的this
                // console.log(captchaObj.getValidate())
                const {
                  // 解构赋值取出后，接口中重名取的别名
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate()
                // getValidate方法 获取用户进行成功验证(onSuccess)所得到的结果，该结果用于进行服务端 SDK 进行二次验证。
                // 请求发送验证码接口，发短信
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
                  // 发送短信后开始倒计时
                  this.codeCountDown()
                })
              })
          }
        )
      })
    },
    // 倒计时
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeSecons--
        if (this.codeSecons <= 0) {
          this.codeCountDown = initCodeSeconds // 让倒计时时间回到初始状态
          window.clearInterval(this.codeTimer) // 清除倒计时
          this.codeTimer = null // 清除倒计时定时器的ID,就算清除了定时器，还有定时器ID，必须清除
        }
      }, 1000)
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
