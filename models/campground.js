var mongoose = require("mongoose");
//SCHMEA

var campgroundSchema = new mongoose.Schema({
	name:String,
	img:String,
	description:String,
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
	]
});

module.exports = mongoose.model("campground",campgroundSchema);