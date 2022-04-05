<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>选择地址</span>
      </nav-bread>

      <div class="checkout-page">
        <div class="container">
          <div class="checkout-addr">
            <!-- process step -->
            <div class="check-step">
              <ul>
                <li class="cur">请选择收货地址</li>
                <li>请确认您的订单</li>
                <!-- <li>请支付</li> -->
                <li>待发货</li>
              </ul>
            </div>

            <!-- address list -->
            <div class="page-title-normal checkout-title">
              <h2><span>收货地址</span></h2>
            </div>
            <div class="addr-list-wrap">
              <div class="addr-list">
                <ul>
                  <li v-for="(item,index) in addressListFilter" v-bind:class="{'check':checkIndex==index}" @click="checkIndex=index;selectedAddrId=item.addressId" :key="item.addressId">
                    <dl>
                      <dt>{{item.userName}}</dt>
                      <dd class="address">{{item.streetName}}</dd>
                      <dd class="tel">{{item.tel}}</dd>
                    </dl>
                    <div class="addr-opration addr-del">
                      <i class="el-icon-delete" @click="delAddressConfirm(item.addressId)"></i>
                    </div>
                    <div class="addr-opration addr-set-default">
                      <a href="javascript:;" class="addr-set-default-btn" v-if="!item.isDefault" @click="setDefault(item.addressId)"><i>设为默认地址</i></a>
                    </div>
                    <div class="addr-opration addr-default" v-if="item.isDefault">默认地址</div>
                  </li>
                  <li class="addr-new">
                    <div class="add-new-inner" @click="isShow=true">
                      <i class="el-icon-plus" style="fontSize: 40px"></i>
                      <p>添加收货地址</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="shipping-addr-more">
                <a class="addr-more-btn up-down-btn" href="javascript:;" @click="expand" v-bind:class="{'open':limit>3}">
                  更多
                  <i class="i-up-down">
                    <i class="i-up-down-l"></i>
                    <i class="i-up-down-r"></i>
                  </i>
                </a>
              </div>
            </div>

            <div class="order-foot-wrap" style="marginTop: 100px">
              <div class="prev-btn-wrap">
                <el-button size="medium" @click="this.goback">返回</el-button>
              </div>
              <div class="next-btn-wrap">
                <el-button size="medium" @click="this.next" type="primary">下一步</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog title="新增地址" :visible.sync="isShow">
        <div class="md-content">
          <div class="confirm-tips">
            <div class="error-wrap">
              <span class="error error-show">{{this.errorTip}}</span>
            </div>
            <ul>
              <li class="regi_form_input">
                <i class="el-icon-s-custom"></i>
                <input type="text" tabindex="1" name="username" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="请输入姓名" data-type="loginname">
              </li>
              <li class="regi_form_input noMargin">
                <i class="el-icon-map-location"></i>
                <input type="text" tabindex="2"  name="address" v-model="address" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="请输入地址" @keyup.enter="login">
              </li>
              <li class="regi_form_input noMargin">
                <i class="el-icon-phone-outline"></i>
                <input type="text" tabindex="3"  name="phone" v-model="phone" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="请输入联系电话" @keyup.enter="login">
              </li>
            </ul>
          </div>
          <div class="login-wrap">
            <a href="javascript:;" class="btn-login" @click="addAddress">保存</a>
          </div>
        </div>
      </el-dialog>
      <modal :mdShow="isMdShow" @close="closeModal">
        <p slot="message">
          您是否确认要删除此地址?
        </p>
        <div slot="btnGroup">
            <a class="btn btn--m" href="javascript:;" @click="delAddress">确认</a>
            <a class="btn btn--m btn--red" href="javascript:;" @click="isMdShow=false">取消</a>
        </div>
      </modal>
      <!-- <nav-footer></nav-footer> -->
    </div>
</template>
<style>
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
              limit:3,
              checkIndex:1,
              selectedAddrId:'',
              addressList:[],
              isMdShow:false,
              addressId:'',
              isShow: false,
              userName: '',
              address: '',
              phone: ''
          }
      },
      mounted(){
          this.init();
      },
      computed:{
        addressListFilter(){
          return this.addressList.slice(0,this.limit);
        }
      },
      components:{
        NavHeader,
        NavFooter,
        NavBread,
        Modal
      },
      methods:{
          init(){
              axios.get("/address/addressList").then((response)=>{
                  let res = response.data;
                  this.addressList = res.result;
                  this.selectedAddrId = this.addressList[0].addressId;
              });
          },
          expand(){
              if(this.limit==3){
                this.limit = this.addressList.length;
              }else{
                this.limit = 3;
              }
          },
          goback () {
            this.$router.push({path: '/cart'})
          },
          next() {
            this.$router.push({
              path:'/orderConfirm',
              query:{'addressId':this.selectedAddrId}
            })
          },
          setDefault(addressId){
              axios.post("/address/setDefault",{
                addressId:addressId
              }).then((response)=>{
                  let res = response.data;
                  if(res.status=='0'){
                     this.init();
                  }
              })
          },
          closeModal(){
              this.isMdShow = false;
          },
          delAddressConfirm(addressId){
            this.isMdShow = true;
            this.addressId = addressId;
          },
          delAddress(){
            axios.post("/address/delAddress",{
              addressId:this.addressId
            }).then((response)=>{
                let res = response.data;
                if(res.status=="0"){
                  this.isMdShow = false;
                  this.init();
                }
            })
          },
          addAddress() {
            axios.post("/address/addAddress",{
              userName: this.userName,
              address: this.address,
              phone: this.phone
            }).then((response)=>{
                let res = response.data;
                if(res.status=="0"){
                  this.isShow = false;
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  this.init();
                } else
                  this.$message.error('保存失败，请重试');
            })
          }
      }
  }
</script>
