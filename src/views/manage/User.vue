<template>
  <el-card class="box-card card">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
      background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="userList" index-path="/notice/show">用户列表</el-menu-item>
        <!-- <el-menu-item index="/clothing/addClothing" >添加服装</el-menu-item> -->
    </el-menu>
    <el-form :inline="true" :model="searchItems" class="demo-form-inline" label-position="right" label-width="100px" style="marginTop: 10px">
      <el-form-item label="用户账号">
        <el-input v-model="searchItems.userId" placeholder="请输入用户账号"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名">
        <el-input v-model="searchItems.userName" placeholder="请输入用户姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="users" stripe style="width: 100%"  :header-cell-style="headstyle">
      <el-table-column
        prop="userId"
        label="账号"
        width="220">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        width="240">
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        width="230">
      </el-table-column>
      <!-- <el-table-column
        prop="addressList[0].streetName"
        label="地址"
        width="200">
      </el-table-column> -->
      <el-table-column
        prop="cartList.length"
        label="购物车数量"
        width="220">
      </el-table-column>
      <el-table-column
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button size="small" @click.native.prevent="editUser(scope.row)">
            <i class="el-icon-edit"></i>
              编辑
          </el-button>
          <el-button type="danger" size="small" @click.native.prevent="showDeleteModal(scope.row.userId)">
            <i class="el-icon-delete"></i>
            删除
          </el-button>
        </template>
        
      </el-table-column>
    </el-table>
    <el-pagination  background  layout="prev, pager, next"  :page-size="5"  :total='19'  @current-change="changePage">
    </el-pagination>
    <!-- 删除提示框 -->
    <el-dialog :visible.sync="deleteConfirm">
      <span>您确定要删除这个用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirm = false">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户编辑框 -->
    <el-dialog :visible.sync="showEdit" title="修改用户信息" width="30%" center>
      <el-form ref="form" :model="form" label-width="50px">
        <el-form-item label="账号">
          <el-input v-model="form.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择活动区域" style="width: 100%">
            <el-option label="普通用户" value="normal"></el-option>
            <el-option label="管理员" value="manager"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
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
        activeIndex: 'userList',
        searchItems:{
          userId:'',
          userName:''
        },
        form: {
          userId: '',
          password: '',
          userName: '',
          role: 'normal'
        },
        headstyle:{
          background:"rgb(242,242,242)"
        },
        users: [], // 用户列表
        userName: '', // 用户名
        deleteConfirm: false, // 是否展示删除框
        showEdit: false, // 是否展示用户编辑框
        deleteUserId: '', // 删除用户id
        total: null,
        page: 1
      }
    },
    mounted(){
      this.onSearch();
    },
    methods: {
      // 换页
      changePage(currentPage) {
        this.page = currentPage;
        this.onSearch();
      },
      // 查询
      onSearch(){
        axios.post("/users/allUsers",{
          userId: this.searchItems.userId,
          userName: this.searchItems.userName,
          page: this.page,
          size: 7
        }).then((res)=>{
          var res = res.data;
          if(res.status==0){
            this.users = res.result.userList;
            this.total = res.result.count*5
          }else{
            this.$message.error('数据不存在');
          }
        });
      },
      // 重置
      reset(){
        this.searchItems = {userId:'', userName:''};
        this.onSearch();
      },
      // 编辑用户
      editUser(row){
        this.showEdit = true;
        this.form = {
          userId: row.userId,
          password: row.userPwd,
          userName: row.userName,
          role: row.role || 'normal'
        }
      },
      // 修改用户的角色
      updateRole(){
        axios.post("/users/updateUserRole",{userId: this.form.userId, role: this.form.role}).then((res) => {
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
      // 展示删除弹框
      showDeleteModal(userId){
        this.deleteConfirm = true;
        this.deleteUserId = userId;
      },
      // 删除用户
      deleteUser(){
        axios.post("/users/deleteUser",{userId: this.deleteUserId}).then((res)=>{
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
      }
    }
  }
</script>
