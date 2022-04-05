<template>
  <div>
    <header class="header"><span>购物商城后台管理系统</span></header>
    <div class="aside">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        text-color="#545c64"
        active-text-color="#ffd04b">
        <el-menu-item index="1" @click="onClick('/manage/user')">
          <i class="el-icon-user-solid"></i>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="2" @click="onClick('/manage/good')">
          <i class="el-icon-s-goods"></i>
          <span slot="title">商品管理</span>
        </el-menu-item>
        <el-menu-item index="3" @click="onClick('/manage/order')">
          <i class="el-icon-document"></i>
          <span slot="title">订单管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    
    <main class="router-view"><router-view></router-view></main>
  </div>
</template>

<script>
  export default {
    methods: {
      onClick(path) {
        this.$router.replace(path)
      }
    }
  }
</script>

<style>
  #app{
    height:100vh;
  }
  .header{
    line-height: 7vh;
    font-size: 22px;
    text-align: center;
    letter-spacing: 1px;
    border-bottom: #eeeeee 1px solid;
    /* background-color: #F56C6C; */
  }
  .aside{
    float: left;
    height: 92vh;
    width: 18vw;
    border-right: solid 1px #eeeeee;
    background-color: #ffffff
  }
  .router-view{
    display: flex;
    width: 80vw ;
    padding: 10px;
  }
</style>