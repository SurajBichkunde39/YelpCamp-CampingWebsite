var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require('../models/comment');
var Campground = require('../models/campground');
var middleware = require("../middleware");

//NEW
router.get('/new',middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:foundCampground,});	
		}
	});
});


//CREATE
router.post('/',middleware.isLoggedIn,function(req,res){
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
					createdcomment.author.id = req.user._id;
					createdcomment.author.username = req.user.username;
					createdcomment.save();
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

//EDIT
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	
	Comment.findById(req.params.comment_id,function(err,foundComment){
		let id = req.params.id;
		if(err){
			console.log(err);
			res.redirect('/campgrounds/'+id);
		}else{
			res.render('comments/edit',{campground_id:req.params.id,comment:foundComment});
		}
	});
});


//UPDATE
router.put('/:comment_id',middleware.checkCommentOwnership,function(req,res){
	
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});

//DESTORY
router.delete('/:comment_id',middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

module.exports = router;