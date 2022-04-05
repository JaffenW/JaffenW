<template>
  <el-card class="box-card card">
    <el-menu default-active="orderList" class="el-menu-demo" mode="horizontal"
      background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="orderList" index-path="/notice/show">订单列表</el-menu-item>
        <!-- <el-menu-item index="/clothing/addClothing" >添加服装</el-menu-item> -->
    </el-menu>
    <el-form :inline="true" :model="searchItems" class="demo-form-inline" label-position="right" label-width="100px" style="marginTop: 10px">
      <el-form-item label="订单编号">
        <el-input v-model="searchItems.orderId" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item label="用户账号">
        <el-input v-model="searchItems.userId" placeholder="请输入用户账号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="orderList" stripe style="width: 100%"  :header-cell-style="headstyle">
      <el-table-column
        prop="orderId"
        label="订单编号"
        width="190">
      </el-table-column>
      <el-table-column
        prop="userId"
        label="用户账号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="订单时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="addressId"
        label="地址编号"
        width="185">
      </el-table-column>
      <el-table-column
        prop="orderTotal"
        label="消费总额"
        width="140">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        width="140">
        <template slot-scope="scope">
          <!-- <el-tag -->
            {{statusFilters(scope.row.orderStatus)}}
          <!-- </el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button size="small" @click.native.prevent="handleOrderModal(scope.row)">
            <i class="el-icon-edit"></i>
              编辑
          </el-button>
          <el-button type="danger" size="small" @click.native.prevent="showDeleteModal(scope.row.orderId)">
            <i class="el-icon-delete"></i>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination  background  layout="prev, pager, next"  :page-size="5"  :total="10"  @current-change="changePage">
    </el-pagination>
    <!-- 删除提示框 -->
    <el-dialog :visible.sync="deleteConfirm">
      <span>您确定要删除这个商品信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirm = false">取 消</el-button>
        <el-button type="primary" @click="deleteOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户编辑框 -->
    <el-dialog :visible.sync="showEdit" title="修改订单状态" width="40%" center>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="订单编号" v-if="form.productId">
          <el-input v-model="form.orderId" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单创建时间">
          <el-input v-model="form.createDate" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="form.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货地址编号">
          <el-input v-model="form.addressId" disabled></el-input>
        </el-form-item>
        <el-form-item label="交易总额">
          <el-input v-model="form.orderTotal" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.orderStatus" placeholder="请修改订单状态" style="width: 100%">
            <el-option label="待发货" value="1"></el-option>
            <el-option label="已发货" value="2"></el-option>
            <el-option label="已收货" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="changeStatus">保存</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<style>
  .card{
    width: 100%;
    height: 88vh;
  }
</style>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        searchItems:{ // 查询条件
          orderId:'',
          userId:''
        },
        headstyle:{
          background:"rgb(242,242,242)"
        },
        form: {
          orderId: '',
          createDate: '',
          userId: '',
          addressId: '',
          orderTotal: '',
          orderStatus: ''
        },
        orderList: [], // 订单列表
        orderId: '', // 订单编号
        userId: '', // 用户账号
        showEdit: false,
        deleteConfirm: false, // 是否显示删除确认弹框
        deleteOrderId: '', // 删除订单编号
        total: null, // 商品总数
        page: 1 // 页码
      }
    },
    mounted() {
      this.onSearch();
    },
    methods: {
      // 换页
      changePage(currentPage) {
        this.page = currentPage;
        this.onSearch();
      },
      // 重置
      reset(){
        this.searchItems = {orderId:'', userId:''};
        this.onSearch();
      },
      // 查询
      onSearch(){
        axios.post("/orders/queryOrderList",{
          orderId: this.searchItems.orderId,
          userId: this.searchItems.userId,
          page: this.page,
          size: 7
        }).then((res)=>{
          var res = res.data;
          if(res.status==0){
            this.orderList = res.result.orderList;
            this.total = res.result.count*5;
          }else{
            this.$message.error('数据不存在');
          }
        });
      },
      // 展示弹框
      showDeleteModal(orderId){
        this.deleteConfirm = true;
        this.deleteOrderId = orderId;
      },
      // 显示订单弹框
      handleOrderModal(row){
        this.showEdit = true;
        if(row) {
          this.form = {
            orderId: row.orderId,
            createDate: row.createDate,
            userId: row.userId,
            addressId: row.addressId,
            orderTotal: row.orderTotal,
            orderStatus: row.orderStatus
          }
        } else {
          this.form = {
            orderId: '',
            createDate: '',
            userId: '',
            addressId: '',
            orderTotal: '',
            orderStatus: ''
          }
        }
      },
      // 格式化订单状态详情
      statusFilters(orderStatus) {
        console.log('订单状态',orderStatus)
        return orderStatus === "1" ? '待发货': orderStatus === '2' ? '已发货' : orderStatus === '3' ? '已收货' : '暂无发货信息'
      },
      // 删除订单
      deleteOrder(){
        axios.post("/orders/deleteOrder",{orderId: this.deleteOrderId}).then((res)=>{
          if(res && res.data && res.data.status == 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          } else {
            this.$message.error('删除失败');
          }
          this.deleteConfirm = false;
          this.reset();
        });
      },
      // 改变订单的状态
      changeStatus(){
        axios.post("/orders/changeStatus",{orderId: this.form.orderId, orderStatus: this.form.orderStatus}).then((res) => {
          if (res && res.data && res.data.status == 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          } else {
            this.$message.error('修改失败');
          }
          this.showEdit = false;
          this.onSearch();
        })
      },
    }
  }
</script>
