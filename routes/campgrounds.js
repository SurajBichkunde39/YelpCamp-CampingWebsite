var express = require("express");
var router = express.Router();
var Campground = require('../models/campground');
var User = require('../models/user');
var middleware = require("../middleware");


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
	var price = req.body.price;
	var author = {
		id:req.user._id,
		username:req.user.username,
	}
	var newCampfround = {
		name:name,
		img:img,
		price:price,
		description:description,
		author:author,
	}
	//add newly created campgrounds to the database
	Campground.create(newCampfround,function(err,newCampfround){
		if(err){
			console.log(err);
		}else{
			req.flash("success","New Campground Created !!")
			res.redirect('/campgrounds');
		}
	});
});


//NEW - take info about new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new",{});
});


//SHOW - Show info of specific campground
router.get("/:id",function(req,res){
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","No Campground Found On Given Id");
			res.redirect('/campgrounds');
		}else{
			res.render("campgrounds/show",{campground:foundCampground,});	
		}
	});
});

//EDIT - form to edit campground info
router.get('/:id/edit',middleware.checkCampgroundOwnership,function(req,res){
	var id = req.params.id;
	Campground.findById(id,function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("No Campground Found");
			res.redirect('/campgrounds');
		}else{
			res.render('campgrounds/edit',{campground:foundCampground});	
		}
	});
});

//UPDATE - save changes done in edit  
router.put('/:id',middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect('/campgrounds');
		}else{
			res.redirect('/campgrounds/'+updatedCampground._id);
		}
	});
});

//DESTORY - delete the selected campground 
router.delete('/:id',middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect('/campgrounds');
		}else{
			req.flash("success","Successfully Deleted the Campground");
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;