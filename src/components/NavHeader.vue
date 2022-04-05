<template>
    <header class="header">
      <div class="navbar">
          <!-- logo图片 -->
          <div class="navbar-left-container">
          </div>
          <!-- 登录注册按钮 -->
          <div class="navbar-right-container" style="display: flex;">
            <div class="navbar-menu-container">
              <el-menu class="el-menu-demo" mode="horizontal" v-if="nickName"  :style="{borderBottom:'none', background: 'transparent'}">
                <el-submenu index='index'>
                  <template slot="title"><span class="navbar-link" v-text="nickName"></span></template>
                  <el-menu-item @click="toAddress" index="1">我的地址</el-menu-item>
                  <el-menu-item @click="toOrderList" index="2">我的订单</el-menu-item>
                  <el-menu-item @click="toManage" index="3" v-if="role === 'manager'">后台管理</el-menu-item>
                </el-submenu>
              </el-menu>
              <span class="navbar-link" @click="loginModalFlag=true" v-if="!nickName" style="color: red">亲，请登录</span>
              <span class="navbar-link" @click="logOut" v-else>注销</span>
              <div class="navbar-cart-container">
                <!-- 购物车的图标 -->
                <!-- <span class="navbar-cart-count" v-text="cartCount" v-if="cartCount"></span> -->
                <a class="navbar-link navbar-cart-link" style="fontSize: 30px" href="/#/cart">
                  <el-badge :value="cartCount" class="item" type="primary"> 
                    <i class="el-icon-shopping-cart-full"></i>
                  </el-badge>
                </a>
              </div>
            </div>
          </div>
      </div>
      <!-- 悬浮框用于登录 -->
      <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':loginModalFlag}">
        <div class="md-modal-inner">
          <div class="md-top">
            <div class="md-title">登录</div>
            <button class="md-close" @click="onClose('login')">关闭</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <div class="error-wrap">
                <span class="error error-show">{{errorTip}}</span>
              </div>
              <ul>
                <li style="marginBottom: 20px">
                  <el-input type="text" prefix-icon="el-icon-user" v-model="userId" placeholder="请输入账号"></el-input>
                </li>
                <li style="marginBottom: 20px">
                  <el-input type="password" prefix-icon="el-icon-unlock" v-model="userPassword" placeholder="请输入密码" show-password></el-input>
                </li>
              </ul>
            </div>
            <div class="login-wrap">
              <a href="javascript:;" class="btn-login" @click="login" width="100px">登  录</a>
            </div>
            <div class="login-wrap" style="display: flex;justify-content: center">
              还没有账号？请点击<a @click="toRegister" style="color: red">注册</a>
            </div>
          </div>
        </div>
      </div>
      <!-- 用户注册浮框 -->
      <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':registerModalFlag}">
        <div class="md-modal-inner">
          <div class="md-top">
            <div class="md-title">注册</div>
            <button class="md-close" @click="onClose('register')">关闭</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <div class="error-wrap">
                <span class="error error-show">{{this.errorTip}}</span>
              </div>
              <ul>
                <li style="marginBottom: 20px">
                  <el-input type="text" prefix-icon="el-icon-user" v-model="userId" placeholder="请输入账号"></el-input>
                </li>
                <li style="marginBottom: 20px">
                  <el-input type="password" prefix-icon="el-icon-unlock" v-model="userPassword" placeholder="请输入密码" show-password></el-input>
                </li>
                <li style="marginBottom: 20px">
                  <el-input prefix-icon="el-icon-search" v-model="userName" placeholder="请输入登录名"></el-input>
                </li>
              </ul>
            </div>
            <div class="login-wrap">
              <a href="javascript:;" class="btn-login" @click="register">注册</a>
            </div>
            <div class="login-wrap" style="display: flex;justify-content: center">
              返回<a @click="registerModalFlag = false;loginModalFlag=true" style="color: red">登录</a>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-if="loginModalFlag" @click="onClose('all')"></div>
    </header>
</template>
<style>
  .header {
    width: 100%;
    /* background-color: white; */
    background: url('/static/background.jpeg');
    background-repeat: no-repeat;
    background-size: 100%;
    font-family: "moderat",sans-serif;
    font-size: 16px;
    /* background-image: url('/static/logo.png');
    background-repeat: repeat-y; */
  }
  .navbar {
    display: flex;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    height: 90px;
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px 20px 10px 20px;
  }
  .navbar-left-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: -20px;
  }
  .el-menu {
    background: transparent;
  }
  .el-submenu__title {
    background: transparent !important;
  }
  .header a, .footer a {
    color: #666;
    text-decoration: none;
  }
  a {
    -webkit-transition: color .3s ease-out;
    transition: color .3s ease-out;
  }
  .navbar-right-container {
    display: none;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 0 10px 0;
  }
  .navbar-menu-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 10px;
  }
  .navbar-link {
    padding-left: 15px;
    font-size: 20px;
  }
  span.navbar-link:hover {
    color: #ee7a23;
  }
  .navbar-cart-container {
    position: relative;
  }
  .navbar-cart-count {
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -9px;
    right: -11px;
    width: 20px;
    border-radius: 10px;
    color: white;
    background-color: #eb767d;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .navbar-cart-logo {
    width: 25px;
    height: 25px;
    transform: scaleX(-1);
  }
</style>
<script>
    import './../assets/css/login.css'
    import axios from 'axios'
    import { mapState } from 'vuex'
    export default{
        data(){
            return{
              userId:'',
              userPassword:'',
              userName: '',
              errorTip:'',
              loginModalFlag:false,
              registerModalFlag:false
            }
        },
        computed:{
          ...mapState(['nickName','cartCount','role'])
        },
        /*nickName(){
          return this.$store.state.nickName;
        },
        cartCount(){
          return this.$store.state.cartCount;
        }*/
        mounted(){
            this.checkLogin();
        },
        methods:{
            // 检查是否登录
            checkLogin(){
                axios.get("/users/checkLogin").then((response)=>{
                    var res = response.data;
                    var path = this.$route.pathname;
                    if(res.status=="0"){
//                      this.nickName = res.result;
                      this.$store.commit("updateUserInfo",res.result.userName);
                      this.$store.commit("updateUserRole", res.result.role);
                      this.getCartCount();
                      this.loginModalFlag = false;
                    }else{
                      if(this.$route.path!="/goods"){
                        this.$router.push("/goods");
                      }
                    }
                });
            },
            // 进行登录
            login(){
                if(!this.userId || !this.userPassword){
                  // this.errorTip = '账号或密码不存在';
                  this.$message.error('账号或密码不存在');
                  return;
                }
                axios.post("/users/login",{
                  userId:this.userId,
                  userPassword:this.userPassword
                }).then((response)=>{
                    let res = response.data;
                    if(res.status=="0"){
                      this.errorTip = '';
                      this.loginModalFlag = false;
                      this.$store.commit("updateUserInfo",res.result.userName);
                      this.$store.commit("updateUserRole", res.result.role);
                      this.getCartCount();
                    }else{
                      this.$message.error(res.msg);
                    }
                });
            },
            // 进行注册
            register(){
              if(!this.userId || !this.userPassword){
                  this.$message.error('账号或密码不存在');
                  return;
                }
                axios.post("/users/register",{
                  userId:this.userId,
                  userPassword:this.userPassword,
                  userName:this.userName
                }).then((response)=>{
                    let res = response.data;
                    if(res.status=="0"){
                      this.$message({
                        message: res.msg,
                        type: 'success'
                      })
                      this.userId = '';
                      this.userPassword = '';
                      this.userName = '';
                      this.loginModalFlag = true;
                      this.registerModalFlag = false;
                    }else{
                      this.$message.error(response.data.msg);
                    }
                });
            },
            // 进行注销
            logOut(){
                axios.post("/users/logout").then((response)=>{
                    let res = response.data;
                    if(res.status=="0"){
//                        this.nickName = '';
                        this.$store.commit("updateUserInfo",res.result.userName);
                        this.$store.commit("updateUserRole", res.result.role);
                        this.$store.commit("resetCartCount",'');
                        this.$router.push("/goods");
                    }
                })
            },
            // 展示注册界面
            toRegister() {
              this.loginModalFlag = false;
              this.errorTip = '';
              this.registerModalFlag = true;
            },
            // 获得购物车数量
            getCartCount(){
              axios.get("users/getCartCount").then(res=>{
                var res = res.data;
                this.$store.commit("updateCartCount",res.result);
              });
            },
            // 关闭浮框
            onClose(flag){
              this.errorTip = '';
              if (flag === 'login') {
                this.loginModalFlag = false;              
              } else if(flag === 'register') {
                this.registerModalFlag = false;
              } else {
                this.loginModalFlag = false;
                this.registerModalFlag = false;
              }
              
            },
            // 转到地址页面
            toAddress(){
              this.$router.push({
                path: '/address'
              })
            },
            // 转到订单页面
            toOrderList(){
              this.$router.push({
                path: '/orderList'
              })
            },
            // 转到后台管理页面
            toManage(){
              this.$router.push({
                path: '/manage'
              })
            }
        }
    }
</script>
