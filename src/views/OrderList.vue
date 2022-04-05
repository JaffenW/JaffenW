<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>我的订单</span>
    </nav-bread>
    
    <div class="container" style="width: 70%">
      <div class="cart">

        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>我的订单</span></h2>
        </div>

        <div class="item-list-wrap">
          <div class="cart-item" style="backgroundColor: white">
            <table class="table-style" cellpadding="0px">

              <thead style="backgroundColor: rgb(245,245,245)">
                <tr>
                  <td colspan="2" style="padding: 10px">订单详情</td>
                  <td align="center">收货人</td>
                  <td align="center">金额</td>
                  <td align="center">操作</td>
                </tr>
              </thead>

              <tbody v-for="item in orderList" :key="item.orderId" class="tbody-style">
                <tr class="space"><td style="height: 30px"></td></tr>
                <tr class="item-header">
                  <td colspan="1"  style="padding: 10px">
                    {{item.createDate}}
                  </td>
                  <td colspan="1">
                    订单号：{{item.orderId}}
                  </td>
                  <td colspan="2"></td>
                  <td align='center'><i class="el-icon-delete" @click="onDelete(item)"></i></td>
                </tr>

                <tr class="item-good">
                  <td colspan="2">
                    <div v-for="(items) in item.goodList" :key="items.productId" class="good-item">
                      <img v-lazy="'/static/'+items.productImage" v-bind:alt="item.productName" class="img-style">
                      <div class="good-item-text">
                        <div>{{items.productName}}</div>
                        <div><i class="el-icon-close"></i>{{items.productNum}}</div>
                      </div>
                      
                    </div>
                  </td>
                  <td class="bd" align="center">{{userName}}<i class="el-icon-user"></i></td>
                  <td class="bd" align="center">支付金额 {{item.orderTotal|currency('￥')}}</td>
                  <!-- <td class="bd" align="center"><a @click="getOrderDetail(item.orderId)">订单详情</a></td> -->
                  <td class="bd" align="center">{{item.orderStatus === '1' ? '待发货':item.orderStatus === '2' ? '已发货': '已收货'}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 删除提示框 -->
    <el-dialog :visible.sync="deleteConfirm">
      <span>您确定要删除这条订单记录吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirm = false">取 消</el-button>
        <el-button type="primary" @click="deleteOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
  .table-style{
    background-color: #ffffff;
    width: 96%;
    margin: 2%;
  }
  .tbody-style{
    /* border: 1px solid #e5e5e5; */
  }
  .space{
    height: 10px;
    border-left: transparent;
  }
  .item-header{
    background-color: rgb(245,245,245);
    border: 1px solid #e5e5e5;
    border-bottom: 0px solid #e5e5e5;
  }
  .item-good{
    border: 1px solid #e5e5e5;
    border-top: transparent
  }
  .good-item{
    display: flex;
    border-top: 1px solid #e5e5e5;
    height: 200px;
    align-items: center;
    /* border-bottom: 1px solid #e5e5e5; */
  }
  .good-item-text{
    line-height: 40px;
    margin-left: 10%;
  }
  .bd{
    border-left: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
  }
  .img-style{
    /* border: 1px solid #e5e5e5; */
    height: 80%;
    margin-left: 20px;
  }
</style>
<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import Modal from './../components/Modal'
    import {currency} from '../util/currency'
    import axios from 'axios'
    export default{
        data(){
            return{
                userName: '', // 用户名
                orderList:[], // 订单列表
                delItem:{}, // 选择要删除的商品
                deleteConfirm:false // 删除商品的确认弹框
            }
        },
        mounted(){
            this.init();
        },
        filters:{
          currency:currency
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
        },
        methods:{
          // 初始化获取购物车商品列表
          init(){
            axios.get("/orders/orderList").then((response)=>{
              const res = response.data;
              if (res && res.status === '0' && res.result) {
                this.userName = res.result.userName;
                this.orderList = res.result.orderList.reverse();
              }
            });
          },
          // 点击的删除的回调
          onDelete(item){
              this.delItem = item;
              this.deleteConfirm = true;
          },
          // 执行删除
          deleteOrder(){
            this.deleteConfirm = false;
            axios.post("/orders/deleteOrder",{
              orderId:this.delItem.orderId
            }).then((response)=>{
                let res = response.data;
                if(res.status == '0'){
                  this.modalConfirm = false;
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                  this.init();
                } else
                  this.$message.error('删除失败:', res.msg);
            });
          },
          // 获取订单详情
          getOrderDetail(orderId){
            console.log('获取订单详情', orderId);
          }
        }
    }
</script>
