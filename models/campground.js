var mongoose = require("mongoose");
//SCHMEA

var campgroundSchema = new mongoose.Schema({
	name:String,
	price:Number,
	img:String,
	description:String,
	author:{
		id:
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User",
		},
		username:String,
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
	]
});

module.exports = mongoose.model("campground",campgroundSchema);