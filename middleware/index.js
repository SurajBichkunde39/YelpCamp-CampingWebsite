middleware_object = {}

middleware_object.checkCampgroundOwnership = function (req,res,next){
	if(req.isAuthenticated()){
		var id = req.params.id;
		Campground.findById(id,function(err,foundCampground){
			if(err || !foundCampground){
				req.flash("error","Campground Not Found");
				return res.redirect('/campgrounds');
			}
			else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permissions to do that!!");
					res.redirect("back");
				}	
			}
			
		});
	}else{
		req.flash("error","You need to be logged in to do that !");
		res.redirect("back");
	}
}

middleware_object.isLoggedIn = function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error","You need to be logged in to do that !");
		res.redirect('/login');
	}
}

middleware_object.checkCommentOwnership = function (req,res,next){
	if(req.isAuthenticated()){
		var id = req.params.comment_id;
		Comment.findById(id,function(err,foundComment){
			if(err || !foundComment){
				req.flash("error","Comment Not Found");
				return res.redirect('/campgrounds');
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error","You need to be logged in to do that !");
		res.redirect("back");
	}
}


module.exports = middleware_object;