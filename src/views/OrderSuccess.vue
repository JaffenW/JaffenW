<template>
    <div>
      <nav-header></nav-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>支付成功</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur">请选择收货地址</li>
            <li class="cur">请确认您的订单</li>
            <!-- <li class="cur">请支付</li> -->
            <li class="cur">待发货</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/success.png" alt=""></div>
          <div class="order-create-main">
            <h3>请稍候! <br>您的商品正在备货中!</h3>
            <p>
              <span>订单编号：{{orderId}}</span><br/><br/>
              <span>实付款：{{orderTotal|currency('￥')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="prev-btn-wrap">
                <el-button size="medium" @click="goBack">返回购物车列表</el-button>
              </div>
              <div class="next-btn-wrap">
                <el-button size="medium" @click="goHome" type="primary">返回商品列表</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <nav-footer></nav-footer> -->
    </div>
</template>
<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import {currency} from './../util/currency'
    import axios from 'axios'
    export default{
        data(){
            return{
                orderId:'',
                orderTotal:0
            }
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread
        },
        filters:{
          currency:currency
        },
        methods: {
          goBack () {
            this.$router.push({path: '/cart'})
          },
          goHome () {
            this.$router.push('/')
          }
        },
        mounted(){
            var orderId = this.$route.query.orderId;
            if(!orderId){
              return;
            }
            axios.get("/orders/orderDetail",{
                params:{
                  orderId:orderId
                }
            }).then((response)=>{
                let res = response.data;
                if(res.status=='0'){
                    this.orderId = orderId;
                    this.orderTotal = res.result.orderTotal;
                }
            });
        }
    }
</script>
