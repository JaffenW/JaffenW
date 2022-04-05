var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
  "orderId":String,
  "createDate":String,
  "orderStatus":String,
  "orderTotal":Number,
  "userId":String,
  "goodList":Array,
  "addressId":String
});

module.exports = mongoose.model("Order",orderSchema);
