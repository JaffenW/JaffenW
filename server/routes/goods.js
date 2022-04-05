var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/vuemall');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});

//查询商品列表数据
router.get("/list", function (req,res,next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let priceLevel = req.param("priceLevel");
  let priceGt = parseInt(req.param('priceGt')) || 0;
  let priceLte = parseInt(req.param('priceLte')) || 999999;
  let sort = req.param("sort");
  let skip = (page-1)*pageSize;
  params = {
    salePrice:{
        $gt:priceGt,
        $lte:priceLte
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err,doc) {
      if(err){
          res.json({
            status:'1',
            msg:err.message
          });
      }else{
          res.json({
              status:'0',
              msg:'',
              result:{
                  count:doc.length,
                  list:doc
              }
          });
      }
  })
});

//加入到购物车
router.post("/addCart", function (req,res,next) {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  var User = require('../models/user');
  User.findOne({userId:userId}, function (err,userDoc) {
    if(err){
        res.json({
            status:"1",
            msg:err.message
        })
    }else{
        if(userDoc){
          var goodsItem = '';
          userDoc.cartList.forEach(function (item) {
              if(item.productId == productId){
                goodsItem = item;
                item.productNum ++;
              }
          });
          if(goodsItem){
            userDoc.save(function (err2,doc2) {
              if(err2){
                res.json({
                  status:"1",
                  msg:err2.message
                })
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'suc'
                })
              }
            })
          }else{
            Goods.findOne({productId:productId}, function (err1,doc) {
              if(err1){
                res.json({
                  status:"1",
                  msg:err1.message
                })
              }else{
                if(doc){
                  doc.productNum = 1;
                  doc.checked = 1;
                  userDoc.cartList.push(doc);
                  userDoc.save(function (err2,doc2) {
                    if(err2){
                      res.json({
                        status:"1",
                        msg:err2.message
                      })
                    }else{
                      res.json({
                        status:'0',
                        msg:'',
                        result:'suc'
                      })
                    }
                  })
                }
              }
            });
          }
        }
    }
  })
});

// 根据商品编号和商品名查询订单
router.post("/queryGoodList", function (req, res, next) {
  const productId = req.body.productId;
	const productName = req.body.productName;
  const page = req.body.page;
  const size = req.body.size;
  let good = Goods.find({ productId: {$regex: productId}, productName: {$regex: productName} }).skip((page-1)*size).limit(size);
  good.exec((err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: "",
      });
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: "",
          result: {
            count: doc.length,
            goodList: doc
          }
        });
      }
    }
  });
});

// 删除商品
router.post('/deleteGood', (req,res,next) => {
  const productId = req.body.productId;
  console.log('商品', productId);
  Goods.deleteOne({productId: productId}, err => {
    if (err) {
      res.json({
        status:"1",
        msg:err.message
      });
    } else {
      res.json({
        status:"0",
        msg:''
    });
    }
  })
})

// 修改商品信息
router.post('/updateGood', (req,res,next) => {
  const productId = req.body.productId;
  const productName = req.body.productName;
  const salePrice = req.body.salePrice;
  const productNum = req.body.productNum;
  const productImage = req.body.productImage
  Goods.update({productId: productId}, { productName, salePrice, productNum, productImage }, err => {
    if (err) {
      res.json({
        status:"1",
        msg:err.message
      });
    } else {
      res.json({
        status:"0",
        msg:''
      });
    }
  })
})

// 添加商品
router.post('/addGood', (req,res,next) => {
  const productId = new Date().Format("yyyyMMddhhmmss");
  const good = new Goods({
    productId: productId,
    productName: req.body.productName,
    salePrice: req.body.salePrice,
    productNum: req.body.productNum,
    productImage: req.body.productImage,
    checked: 'false'
  })
  good.save((err,doc) => {
    if (err) {
      res.json({
        status:"1",
        msg:err.message
      });
    } else {
      res.json({
        status:"0",
        msg:''
      });
    }
  })
})

module.exports = router;
