var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require('../models/comment');
var Campground = require('../models/campground');


router.get('/new',isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:foundCampground,});	
		}
	});
});

router.post('/',isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		}else{
			Comment.create(req.body.comment,function(err,createdcomment){
				if(err){
					console.log(err);
					res.redirect('/campgrounds');
				}else{
					foundCampground.comments.push(createdcomment);
					foundCampground.save(function(err,saved){
						if(err){
							console.log(err);
							res.redirect('/campgrounds');
						}else{
							res.redirect('/campgrounds/'+saved._id);	
						}
					});
				}
			});
			
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