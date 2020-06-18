var mongoose = require("mongoose");
//SCHMEA

var commentSchema = new mongoose.Schema({
	text:String,
	author:String,
});

module.exports = mongoose.model("Comment",commentSchema);