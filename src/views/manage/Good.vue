<template>
  <el-card class="box-card card">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" 
      background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="goodList" index-path="/notice/show">商品列表</el-menu-item>
        <!-- <el-menu-item index="/clothing/addClothing" >添加服装</el-menu-item> -->
    </el-menu>
    <el-form :inline="true" :model="searchItems" class="demo-form-inline" label-position="right" label-width="100px" style="marginTop: 10px">
      <el-form-item label="商品编号">
        <el-input v-model="searchItems.productId" placeholder="请输入商品编号"></el-input>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="searchItems.productName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="success" @click="handleGoodModal">新增</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="goodsList" stripe style="width: 100%"  :header-cell-style="headstyle">
      <el-table-column
        prop="productId"
        label="商品编号"
        width="237">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="商品名称"
        show-overflow-tooltip
        width="237">
      </el-table-column>
      <el-table-column
        prop="productNum"
        label="商品存量"
        width="237">
      </el-table-column>
      <el-table-column
        prop="salePrice"
        label="销售价格"
        width="237">
      </el-table-column>
      <el-table-column
        label="操作"
        width="237">
        <template slot-scope="scope">
          <el-button size="small" @click.native.prevent="handleGoodModal(scope.row)">
            <i class="el-icon-edit"></i>
              编辑
          </el-button>
          <el-button type="danger" size="small" @click.native.prevent="showDeleteModal(scope.row.productId)">
            <i class="el-icon-delete"></i>
            删除
          </el-button>
        </template>
        
      </el-table-column>
    </el-table>
    <el-pagination  background  layout="prev, pager, next"  :page-size="5"  :total="35"  @current-change="changePage">
    </el-pagination>
    <!-- 删除提示框 -->
    <el-dialog :visible.sync="deleteConfirm">
      <span>您确定要删除这个商品信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirm = false">取 消</el-button>
        <el-button type="primary" @click="deleteGood">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 商品编辑框 -->
    <el-dialog :visible.sync="showEdit" :title="getTitle" width="40%" center>
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="商品编号" v-if="form.productId">
          <el-input v-model="form.productId"></el-input>
        </el-form-item>
        <el-form-item label="商品名">
          <el-input v-model="form.productName"></el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input v-model="form.salePrice" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="form.productNum" type="number"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-input v-model="form.productImage"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleGood">保存</el-button>
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
        activeIndex: 'goodList',
        searchItems: {
          productId:'',
          productName:''
        },
        headstyle:{
          background:"rgb(242,242,242)"
        },
        form: {
          productId: '',
          productName: '',
          salePrice: '',
          productNum: '',
          productImage: 'girlclothes3.jpg'
        },
        goodsList: [], // 商品列表
        // flag: true,
        deleteConfirm: false,
        showEdit: false,
        deleteGoodId: '',
        total: null,
        page: 1
      }
    },
    computed: {
      getTitle () {
        return this.form.productId ? '修改商品信息' : '新增商品';
      }
    },
    mounted() {
      // this.getGoodsList(this.flag);
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
        this.searchItems = {productId:'', productName:''};
        this.onSearch();
      },
      // 查询
      onSearch(){
        axios.post("/goods/queryGoodList",{
          productId: this.searchItems.productId,
          productName: this.searchItems.productName,
          page: this.page,
          size: 7
        }).then((res)=>{
          var res = res.data;
          if(res.status==0){
            this.goodsList = res.result.goodList;
            this.total = 35;
          }else{
            this.$message.error('数据不存在');
          }
        });
      },
      // 展示弹框
      showDeleteModal(productId){
        this.deleteConfirm = true;
        this.deleteGoodId = productId;
      },
      // 显示商品弹框
      handleGoodModal(row){
        this.showEdit = true;
        if(row) {
          this.form = {
            productId: row.productId,
            productName: row.productName,
            salePrice: row.salePrice,
            productNum: row.productNum,
            productImage: row.productImage
          }
        } else {
          this.form = {
            productId: '',
            productName: '',
            salePrice: '',
            productNum: '',
            productImage: 'girlclothes3.jpg'
          }
        }
        
      },
      // 新增或者修改商品
      handleGood(){
        if (this.form.productId) {
          // 修改商品信息
          axios.post("/goods/updateGood",this.form).then((res) => {
            if (res && res.data && res.data.status == 0) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            } else {
              this.$message.error('修改失败');
            }
            this.showEdit = false;
            this.form.productId = '';
            this.onSearch();
          })
        } else {
          // 添加商品
          axios.post("/goods/addGood",this.form).then((res) => {
            if (res && res.data && res.data.status == 0) {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
            } else {
              this.$message.error('添加失败');
            }
            this.showEdit = false;
            this.onSearch();
          })
        }
        
      },
      // 删除商品
      deleteGood(){
        axios.post("/goods/deleteGood",{productId: this.deleteGoodId}).then((res)=>{
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
  };
</script>

