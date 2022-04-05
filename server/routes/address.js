var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Address = require('../models/address');

// 添加地址
router.post('/addAddress', (req,res,next) => {
	const userId = req.cookies.userId;
	const userName = req.body.userName;
	const streetName = req.body.address;
	const tel = req.body.phone;

	const platform = '622';
	const r1 = Math.floor(Math.random()*10);
	const r2 = Math.floor(Math.random()*10);

	const sysDate = new Date().Format('yyyyMMddhhmmss');
	const addressId = platform+r1+sysDate+r2;
	const address = new Address({
		addressId: addressId,
		userName: userName,
		streetName: streetName,
		tel: tel,
		postCode: 92268,
		isDefault: "false",
		userId: userId
	});
	address.save((err1, result) => {
		if(err1){
			res.json({
				status:'1',
				msg:'添加失败',
				result:''
			});
		}else{
			res.json({
				status:'0',
				msg:'添加成功',
				result:result
			});
		}
	})
})

//查询用户地址接口
router.get("/addressList", (req,res,next) => {
	const userId = req.cookies.userId;
	Address.find({userId: userId}, (err, doc) => {
		if (err) {
			res.json({
				status: '1',
				msg: '查询失败',
				result: ''
			})
		}else{
      res.json({
        status:'0',
        msg:'',
        result:doc
      });
    }
	})
})

//设置默认地址接口
router.post("/setDefault", function (req,res,next) {
	const userId = req.cookies.userId;
  const addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    });
  }else{
		Address.updateMany({userId: userId},{isDefault: false}, (err1,doc) => {
			if(err1){
        res.json({
          status:'1',
          msg:err1.message,
          result:''
        });
      } else {
				Address.updateOne({addressId: addressId},{isDefault: true}, (err,doc) => {
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
							result:''
						});
					}
				});
			}
		})
    
  }
});

//删除地址接口
router.post("/delAddress", (req,res,next) => {
  const addressId = req.body.addressId;
	Address.deleteOne({ addressId: addressId }, (err,doc) => {
		if (err) {
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:''
			});
		}
	})
});

module.exports = router;