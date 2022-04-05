var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Orders = require("../models/order");
var User = require("../models/user");
var Address = require("../models/address");
var Goods = require("../models/goods");

// 支付
router.post("/payMent", function (req, res, next) {
  const userId = req.cookies.userId, // 用户编号
    addressId = req.body.addressId, // 地址编号
    orderTotal = req.body.orderTotal; // 总金额

  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: "",
      });
    } else {
      let goodsList = [];

      //获取用户购物车的购买商品
      let newCardList = doc.cartList.filter((item) => {
        if (item.checked == "1") {
          goodsList.push(item);
          return false;
        } else return true;
      });
      doc.cartList = [...newCardList];

      var platform = "622";
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);

      var sysDate = new Date().Format("yyyyMMddhhmmss");
      var createDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
      var orderId = platform + r1 + sysDate + r2;
      var order = new Orders({
        orderId: orderId,
        orderTotal: orderTotal,
        addressId: addressId,
        goodList: goodsList,
        orderStatus: "1",
        createDate: createDate,
        userId: userId,
      });
      order.save((err1, doc1) => {
        if (err) {
          res.json({
            status: "1",
            msg: err1.message,
            result: "",
          });
        } else {
          doc.save((err2, doc2) => {
            if (err2) {
              res.json({
                status: "1",
                msg: err2.message,
                result: "",
              });
            } else {
              res.json({
                status: "0",
                msg: "",
                result: {
                  orderId: orderId,
                  orderTotal: orderTotal,
                },
              });
            }
          });
        }
      });
    }
  });
});

// 查询用户的订单列表
router.get("/orderList", function (req, res, next) {
  let userId = req.cookies.userId;
	let userName = req.cookies.userName;
  Orders.find({ userId: userId },function (err, doc) {
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
            userName: userName,
            orderList: doc,
          },
        });
      }
    }
  });
});

// 根据订单号和用户账号查询订单
router.post("/queryOrderList", function (req, res, next) {
  const orderId = req.body.orderId;
	const userId = req.body.userId;
  const page = req.body.page;
  const size = req.body.size;
  let order = Orders.find({ orderId: {$regex: orderId}, userId: {$regex: userId} }).skip((page-1)*size).limit(size);
  
  order.exec((err, doc) => {
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
            orderList: doc,
            count: doc.length
          }
        });
      }
    }
  });
});

//根据订单Id查询订单信息
router.get("/orderDetail", function (req,res,next) {
  var orderId = req.param("orderId");
	Orders.findOne({orderId: orderId}, (err, order) => {
		if(err){
			res.json({
				 status:'1',
				 msg:err.message,
				 result:''
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:order
			})
		}
	})
});

//删除订单接口
router.post("/deleteOrder", function (req,res,next) {
  var orderId = req.body.orderId;
	Orders.deleteOne({orderId: orderId}, (err) => {
		if (err) {
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		} else {
			res.json({
				status:'0',
				msg:'',
				result:''
			});
		}
	})
});

// 改变订单状态
router.post("/changeStatus", (req, res, next) => {
  const orderId = req.body.orderId;
  const orderStatus = req.body.orderStatus;
  Orders.update({ orderId: orderId }, {orderStatus: orderStatus}, (err,result) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
      });
    } else {
      res.json({
        status: "0",
        msg: "",
      });
    }
  });
});

module.exports = router;
