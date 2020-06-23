var express = require("express");
var router = express.Router();
var Campground = require('../models/campground');
var User = require('../models/user');


//INDEX - List all the campgrounds
router.get('/',function(req,res){
	//get all the campgrounds from the database
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:campgrounds});
		}
	});
});

//CREATE - Create the new campground
router.post("/",function(req,res){
	var name = req.body.name;
	var img = req.body.img;
	var description = req.body.description;
	var newCampfround = {
		name:name,
		img:img,
		description:description,
	}
	//add newly created campgrounds to the database
	Campground.create(newCampfround,function(err,newCampfround){
		if(err){
			console.log(err);
		}else{
			res.redirect('/campgrounds');
		}
	});
});


//NEW - take info about new campground
router.get("/new",function(req,res){
	res.render("campgrounds/new",{});
});


//SHOW - Show info of specific campground
router.get("/:id",function(req,res){
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:foundCampground,});	
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect('/login');
	}
}

module.exports = router;