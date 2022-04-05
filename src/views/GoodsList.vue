<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>商品</span>
      </nav-bread>
      
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">排序方式:</span>
            <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortGoods()"><i class="el-icon-bottom" v-if="sortFlag"></i><i class="el-icon-top" v-if="!sortFlag"></i>价格 </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click.stop="showFilterPop">价格区间(元)</a>
          </div>
          
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>价格:</dt>
                <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">所有</a></dd>
                <dd v-for="(item,index) in priceFilter" :key="index">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">
                    {{item.startPrice}} - {{item.endPrice}}
                  </a>
                </dd>
                <dd>
                  <input style="width: 55px" v-model="searchPrice.priceGt" /> - <input style="width: 55px" v-model="searchPrice.priceLte" /> <el-button circle size="small" @click="setPriceFilter('search')">查询</el-button>
                </dd>
              </dl>
            </div>

            <!-- 商品展示列表 -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="item in goodsList" :key="item.productId">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice | currency('￥')}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="view-more-normal"
                  v-infinite-scroll="loadMore"
                  infinite-scroll-disabled="busy"
                  infinite-scroll-distance="200">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
      <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">
             请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
          </div>
      </modal>
      <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <span>加入购物车成!</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal>
      <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
      <!-- <nav-footer></nav-footer> -->
    </div>
</template>
<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import Modal from './../components/Modal'
    import axios from 'axios'
    export default{
        data(){
            return {
                goodsList:[],
                sortFlag:true,
                page:1,
                pageSize:44,
                busy:true,
                loading:false,
                mdShow:false,
                mdShowCart:false,
                priceFilter:[
                  {
                      startPrice:'0.00',
                      endPrice:'100.00'
                  },
                  {
                    startPrice:'100.00',
                    endPrice:'500.00'
                  },
                  {
                    startPrice:'500.00',
                    endPrice:'1000.00'
                  },
                  {
                    startPrice:'1000.00',
                    endPrice:'5000.00'
                  }
                ],
                priceChecked: 'all',
                searchPrice: {
                  priceGt: '',
                  priceLte: ''
                },
                price: {
                  priceGt: 0,
                  priceLte: 999999
                },
                filterBy:false,
                overLayFlag:false
            }
        },
        mounted(){
            this.getGoodsList();
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
        },
        methods:{
          // 获取商品列表
          getGoodsList(flag){
            var param = {
                page:this.page,
                pageSize:this.pageSize,
                sort:this.sortFlag?1:-1,
                priceLevel:this.priceChecked,
                ...this.price
            };
            this.loading = true;
            axios.get("/goods/list",{
              params:param
            }).then((response)=>{
              var res = response.data;
              this.loading = false;
              if(res.status=="0"){
                if(flag){
                    this.goodsList = this.goodsList.concat(res.result.list);

                    if(res.result.count==0){
                        this.busy = true;
                    }else{
                        this.busy = false;
                    }
                }else{
                    this.goodsList = res.result.list;
                    this.busy = false;
                }
              }else{
                this.goodsList = [];
              }
            });
          },
          // 价格排序
          sortGoods(){
              this.sortFlag = !this.sortFlag;
              this.page = 1;
              this.getGoodsList();
          },
          // 查询指定价格区间的商品
          setPriceFilter(index){
            if (index === 'all') {
              this.price = {
                priceGt: 0,
                priceLte: 999999
              };
              this.searchPrice = {
                priceGt: '',
                priceLte: ''
              }
            } else if(index === 'search') {
              this.price = this.searchPrice;
            } else if(index === 0) {
              this.price = {
                priceGt: 0,
                priceLte: 100
              };
              this.searchPrice = {
                priceGt: '',
                priceLte: ''
              }
            } else if(index === 1) {
              this.price = {
                priceGt: 100,
                priceLte: 500
              };
              this.searchPrice = {
                priceGt: '',
                priceLte: ''
              }
            } else if(index === 2) {
              this.price = {
                priceGt: 500,
                priceLte: 1000
              };
              this.searchPrice = {
                priceGt: '',
                priceLte: ''
              }
            } else if(index === 3) {
              this.price = {
                priceGt: 1000,
                priceLte: 5000
              };
              this.searchPrice = {
                priceGt: '',
                priceLte: ''
              }
            }
            this.priceChecked = index;
            this.page = 1;
            this.getGoodsList();
          },
          loadMore(){
              this.busy = true;
              setTimeout(() => {
                this.page++;
                this.getGoodsList(true);
              }, 500);
          },
          addCart(productId){
              axios.post("/goods/addCart",{
                productId:productId
              }).then((res)=>{
                  var res = res.data;
                  if(res.status==0){
                      this.mdShowCart = true;
                      this.getCartCount();
                  }else{
                      this.mdShow = true;
                  }
              });
          },
          closeModal(){
            this.mdShow = false;
            this.mdShowCart = false;
          },
          showFilterPop(){
            this.filterBy=true;
            this.overLayFlag=true;
          },
          closePop(){
            this.filterBy=false;
            this.overLayFlag=false;
            this.mdShowCart = false;
          },
          // 获得购物车数量
          getCartCount(){
            axios.get("users/getCartCount").then(res=>{
              var res = res.data;
              this.$store.commit("updateCartCount",res.result);
            });
          }
        }
    }
</script>
