var express = require("express");
var router = express.Router();
require("./../util/util");
var User = require("./../models/user");

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

router.get("/test", (req, res, next) => {
  res.send("test");
});

// 用户登录
router.post("/login", (req, res, next) => {
  var param = {
    userId: req.body.userId,
    userPwd: req.body.userPassword,
  };
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
      });
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: "/",
          maxAge: 1000 * 60 * 60,
        });
        res.cookie("userName", doc.userName, {
          path: "/",
          maxAge: 1000 * 60 * 60,
        });
        res.cookie("role", doc.role, {
          path: "/",
          maxAge: 1000 * 60 * 60,
        });
        console.log('权限', doc.role);
        //req.session.user = doc;
        res.json({
          status: "0",
          msg: "",
          result: {
            userName: doc.userName,
            role: doc.role || ''
          },
        });
      } else {
        res.json({
          status: "1",
          msg: '账号或密码错误',
        });
      }
    }
  });
});

// 用户注册
router.post("/register", (req, res, next) => {
  var param = {
    userId: req.body.userId,
  };
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
      });
    } else {
      if (doc) {
        res.json({
          status: "1",
          msg: "该账号已注册",
        });
      } else {
        const u = new User({
          userId: req.body.userId,
          userPwd: req.body.userPassword,
          userName: req.body.userName,
          role: 'normal'
        });
        u.save((err1, result) => {
          if (err1) {
            res.json({
              status: "1",
              msg: "注册失败",
              result: "",
            });
          } else {
            res.json({
              status: "0",
              msg: "注册成功",
              result: result,
            });
          }
        });
      }
    }
  });
});

// 修改用户角色
router.post("/updateUserRole", (req, res, next) => {
  const userId = req.body.userId;
  const role = req.body.role;
  User.update({ userId: userId }, {role: role}, (err,result) => {
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

// 删除用户
router.post("/deleteUser", (req, res, next) => {
  const userId = req.body.userId;
  User.deleteOne({ userId: userId }, (err) => {
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

//登出接口
router.post("/logout", (req, res, next) => {
  res.cookie("userId", "", {
    path: "/",
    maxAge: -1,
  });
  res.cookie("role", "", {
    path: "/",
    maxAge: -1,
  });
  res.json({
    status: "0",
    msg: "",
    result: "",
  });
});

// 根据账号和姓名查询用户信息
router.post("/allUsers", (req, res, next) => {
  const userName = req.body.userName;
  const userId = req.body.userId;
  const page = req.body.page;
  const size = req.body.size;
  let user = User.find({
    userName: { $regex: userName },
    userId: { $regex: userId },
  })
    .skip((page - 1) * size)
    .limit(size);
  user.exec((err, users) => {
    if (err) {
      res.json({
        status: "1",
        msg: "",
        result: "",
      });
    } else {
      res.json({
        status: "0",
        msg: "",
        result: {
          count: users.length,
          userList: users,
        },
      });
    }
  });
});

// 检查是否登录
router.get("/checkLogin", (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: "0",
      msg: "",
      result: {
        userName: req.cookies.userName || "",
        role: req.cookies.role || ''
      }
    });
  } else {
    res.json({
      status: "1",
      msg: "未登录",
      result: "",
    });
  }
});

// 获取购物车商品数量
router.get("/getCartCount", (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    User.findOne({ userId: userId }, function (err, doc) {
      if (err) {
        res.json({
          status: "0",
          msg: err.message,
        });
      } else {
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function (item) {
          cartCount += parseFloat(item.productNum);
        });
        res.json({
          status: "0",
          msg: "",
          result: cartCount,
        });
      }
    });
  } else {
    res.json({
      status: "0",
      msg: "当前用户不存在",
    });
  }
});

//查询当前用户的购物车数据
router.get("/cartList", (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({ userId: userId }, function (err, doc) {
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
          result: doc.cartList,
        });
      }
    }
  });
});

//购物车删除
router.post("/cartDel", (req, res, next) => {
  var userId = req.cookies.userId,
    productId = req.body.productId;
  User.update(
    {
      userId: userId,
    },
    {
      $pull: {
        cartList: {
          productId: productId,
        },
      },
    },
    function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: "",
        });
      } else {
        res.json({
          status: "0",
          msg: "",
          result: "suc",
        });
      }
    }
  );
});

//修改商品数量
router.post("/cartEdit", (req, res, next) => {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update(
    { userId: userId, "cartList.productId": productId },
    {
      "cartList.$.productNum": productNum,
      "cartList.$.checked": checked,
    },
    function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: "",
        });
      } else {
        res.json({
          status: "0",
          msg: "",
          result: "suc",
        });
      }
    }
  );
});

// 全选商品
router.post("/editCheckAll", (req, res, next) => {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll ? "1" : "0";
  User.findOne({ userId: userId }, function (err, user) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: "",
      });
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        });
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: "1",
              msg: err1,
              message,
              result: "",
            });
          } else {
            res.json({
              status: "0",
              msg: "",
              result: "suc",
            });
          }
        });
      }
    }
  });
});

// 支付
// router.post("/payMent", function (req,res,next) {
//   var userId = req.cookies.userId,
//     addressId = req.body.addressId,
//     orderTotal = req.body.orderTotal;
//   User.findOne({userId:userId}, function (err,doc) {
//      if(err){
//         res.json({
//             status:"1",
//             msg:err.message,
//             result:''
//         });
//      }else{
//        var address = '',goodsList = [];
//        //获取当前用户的地址信息
//        doc.addressList.forEach((item)=>{
//           if(addressId==item.addressId){
//             address = item;
//           }
//        })
//        //获取用户购物车的购买商品
//        const newCardList = doc.cartList.filter((item)=>{
//          if(item.checked=='1'){
//            goodsList.push(item);
//            return false;
//          } else return true;
//        });
//        doc.cartList = [...newCardList];

//        var platform = '622';
//        var r1 = Math.floor(Math.random()*10);
//        var r2 = Math.floor(Math.random()*10);

//        var sysDate = new Date().Format('yyyyMMddhhmmss');
//        var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
//        var orderId = platform+r1+sysDate+r2;
//        var order = {
//           orderId:orderId,
//           orderTotal:orderTotal,
//           addressInfo:address,
//           goodsList:goodsList,
//           orderStatus:'1',
//           createDate:createDate
//        };

//       //  doc.orderList.push(order);
//       let { orderList } = doc;
//       doc.orderList = [...orderList,order];

//        doc.save(function (err1,doc1) {
//           if(err1){
//             res.json({
//               status:"1",
//               msg:err1.message,
//               result:''
//             });
//           }else{
//             res.json({
//               status:"0",
//               msg:'',
//               result:{
//                 orderId:order.orderId,
//                 orderTotal:order.orderTotal
//               }
//             });
//           }
//        });
//      }
//   })
// });

// 查询用户的订单列表
// router.get("/orderList", function (req,res,next) {
//   var userId = req.cookies.userId;
//   User.findOne({userId:userId}, function (err,doc) {
//       if(err){
//         res.json({
//           status:'1',
//           msg:err.message,
//           result:''
//         });
//       }else{
//           if(doc){
//             res.json({
//               status:'0',
//               msg:'',
//               result: {
//                 userName: doc.userName,
//                 orderList: doc.orderList
//                 }
//             });
//           }
//       }
//   });
// });

// //根据订单Id查询订单信息
// router.get("/orderDetail", function (req,res,next) {
//   var userId = req.cookies.userId,orderId = req.param("orderId");
//   User.findOne({userId:userId}, function (err,userInfo) {
//       if(err){
//           res.json({
//              status:'1',
//              msg:err.message,
//              result:''
//           });
//       }else{
//          var orderList = userInfo.orderList;
//          if(orderList.length>0){
//            var orderTotal = 0;
//            orderList.forEach((item)=>{
//               if(item.orderId == orderId){
//                 orderTotal = item.orderTotal;
//               }
//            });
//            if(orderTotal>0){
//              res.json({
//                status:'0',
//                msg:'',
//                result:{
//                  orderId:orderId,
//                  orderTotal:orderTotal
//                }
//              })
//            }else{
//              res.json({
//                status:'120002',
//                msg:'无此订单',
//                result:''
//              });
//            }
//          }else{
//            res.json({
//              status:'120001',
//              msg:'当前用户未创建订单',
//              result:''
//            });
//          }
//       }
//   })
// });

// //删除订单接口
// router.post("/deleteOrder", function (req,res,next) {
//   var userId = req.cookies.userId,orderId = req.body.orderId;
//   User.update({
//     userId:userId
//   },{
//     $pull:{
//       'orderList':{
//         'orderId':orderId
//       }
//     }
//   }, function (err,doc) {
//       if(err){
//         res.json({
//             status:'1',
//             msg:err.message,
//             result:''
//         });
//       }else{
//         res.json({
//           status:'0',
//           msg:'',
//           result:''
//         });
//       }
//   });
// });

module.exports = router;
