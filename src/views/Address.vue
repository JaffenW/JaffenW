<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>我的地址</span>
      </nav-bread>
      <div class="checkout-page">
        <div class="container" style="width: 50%; backgroundColor: white; padding: 30px">
          <div class="checkout-addr">
            <div class="page-title-normal checkout-title">
              <h2><span>我的收货地址</span></h2>
            </div>

            <!-- 地址列表渲染区域 -->
            <div v-for="(item) in addressList" :key="item.addressId">
              <el-card class="address-card">
                <dl class="card-left">
                  <dt> 收货人：{{item.userName}}</dt>
                  <dd class="address">收货地址：{{item.streetName}}</dd>
                  <dd class="tel">  手机：{{item.tel}}</dd>
                </dl>
                <div class="card-right">
                  <i class="el-icon-delete-solid" @click="delAddressConfirm(item.addressId)" style="marginLeft: 30px" />
                  <!-- <i class="el-icon-edit" @click="edit(item.addressId)" style="marginLeft: 30px" /> -->
                    <div class="addr-opration addr-set-default">
                      <a href="javascript:;" class="addr-set-default-btn" v-if="!item.isDefault" @click="setDefault(item.addressId)"><i>设为默认地址</i></a>
                    </div>
                    <div class="addr-opration addr-default" v-if="item.isDefault">默认地址</div>
                </div>
              </el-card>
            </div>

            <!-- 下边按钮区域 -->
            <!-- <div class="btn btn--red btn-add" @click="isShow=true">
              >添加收货地址
            </div>

            <div class="next-btn-wrap btn-back">
              <router-link class="btn btn--red" to="/goods">返回</router-link>
            </div> -->
            <el-button style="marginLeft: 33%" @click="goback">返回</el-button>
            <el-button type="primary" @click="isShow=true"><i class="el-icon-plus" />添加收货地址</el-button>
            
          </div>
        </div>
      </div>

      <!-- 新增地址悬浮窗 -->
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

      <!-- 删除地址确认框 -->
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
  .address-card{
    height: 100px;
    margin-bottom: 10px;
  }
  .card-left{
    float: left;
    width: 70%
  }
  .card-right{
    float: right;
    width: 30%
  }
  .btn-add{
    display: inline-block;
    margin-left: 50px;
    background-color: #d1434a;
    border-color: #d1434a;
    color: #fff;
  }
  .btn-back{
    display: inline-block;
    margin-left: 200px
  }
</style>
<script>
  import NavHeader from './../components/NavHeader'
  import NavFooter from './../components/NavFooter'
  import NavBread from './../components/NavBread'
  import Modal from './../components/Modal'
  import axios from 'axios'
  export default{
      data(){
          return{
              limit:3,
              checkIndex:0,
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
        // 获取地址列表
        init(){
            axios.get("/address/addressList").then((response)=>{
                let res = response.data;
                this.addressList = res.result;
                this.selectedAddrId = this.addressList[0].addressId;
            });
        },
        // 设置默认地址
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
        // 处理新增编辑弹框
        // handleAddressModal(row){
        //   this.showEdit = true;
        //   if(row) {
        //     userName = row.userName;
        //     address = row.address;
        //     phone = row.phone
        //   } else {
        //     userName = '';
        //     address = '';
        //     phone = ''
        //   }
        // },
        // 返回
        goback () {
          this.$router.push({path: '/goods'})
        },
        // 关闭删除框
        closeModal(){
            this.isMdShow = false;
        },
        // 删除确认
        delAddressConfirm(addressId){
          this.isMdShow = true;
          this.addressId = addressId;
        },
        // 删除地址
        delAddress(){
          axios.post("/address/delAddress",{
            addressId:this.addressId
          }).then((response)=>{
              let res = response.data;
              if(res.status=="0"){
                this.isMdShow = false;
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.init();
              } else this.$message.error('删除失败，请重试');
          })
        },
        // 添加地址
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
        },
        // 编辑地址
        edit(){
          console.log('进行地址编辑')
        }
      }
  }
</script>
