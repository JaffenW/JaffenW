<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>订单确认</span>
    </nav-bread>
    
    <div class="container">
      <div class="checkout-order">
        
        <div class="check-step">
          <ul>
            <li class="cur">请选择收货地址</li>
            <li class="cur">请确认您的订单</li>
            <li>待发货</li>
          </ul>
        </div>

        <!-- order list -->
        <div class="page-title-normal checkout-title">
          <h2><span>订单内容</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <ul class="cart-item-list">
              <li v-for="item in cartList" v-if="item.checked=='1'" :key="item.productId">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img v-lazy="'/static/'+item.productImage" :alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice|currency('￥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">×{{item.productNum}}</span>
                      </div>
                    </div>
                    <!-- <div class="item-stock item-stock-no">In Stock</div> -->
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{(item.salePrice*item.productNum)|currency('￥')}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="price-count-wrap">
          <div class="price-count">
            <ul>
              <li>
                <span>合计:</span>
                <span>{{subTotal|currency('￥')}}</span>
              </li>
              <li>
                <span>折扣:</span>
                <span>{{discount|currency('￥')}}</span>
              </li>
              <li class="order-total-price">
                <span>实付款:</span>
                <span>{{orderTotal|currency('￥')}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap" style="marginTop: 100px">
          <div class="prev-btn-wrap">
            <el-button size="medium" @click="this.goback">返回</el-button>
          </div>
          <div class="next-btn-wrap">
            <el-button size="medium" @click="payMent" type="primary">支付</el-button>
          </div>
        </div>
      </div>
    </div>
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
              shipping:100,
              discount:0, // 折扣
              subTotal:0, // 合计
              orderTotal:0, // 实付
              cartList:[]
          }
      },
      mounted(){
          this.init();
      },
      components:{
        NavHeader,
        NavFooter,
        NavBread
      },
      filters:{
        currency:currency
      },
      methods:{
        init(){
          axios.get("/users/cartList").then((response)=>{
              let res = response.data;
              this.cartList = res.result;

              this.cartList.forEach((item)=>{
                  if(item.checked=='1'){
                      this.subTotal += item.salePrice*item.productNum;
                  }
              });

              this.orderTotal = this.subTotal-this.discount;
          });
        },
        goback () {
          this.$router.push({path: '/selectAddress'})
        },
        payMent(){
            var addressId = this.$route.query.addressId;
            axios.post("/orders/payMent",{
              addressId:addressId,
              orderTotal:this.orderTotal
            }).then((response)=>{
                let res = response.data;
                if(res.status=="0"){
                    this.$router.push({
                        path:'/orderSuccess?orderId='+res.result.orderId
                    })
                }
            })
        }
      }
  }
</script>
