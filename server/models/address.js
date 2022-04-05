var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
  "addressId":String,
  "isDefault":Boolean,
  "postCode":String,
  "streetName":String,
  "tel":String,
  "userName":String,
  "userId":String
});

module.exports = mongoose.model("Address",addressSchema);
