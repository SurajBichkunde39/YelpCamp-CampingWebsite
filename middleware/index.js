middleware_object = {}

middleware_object.checkCampgroundOwnership = function (req,res,next){
	if(req.isAuthenticated()){
		var id = req.params.id;
		Campground.findById(id,function(err,foundCampground){
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			}else{
				res.redirect("back");
			}
		});
	}else{
		res.redirect("back");
	}
}

middleware_object.isLoggedIn = function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect('/login');
	}
}

middleware_object.checkCommentOwnership = function (req,res,next){
	if(req.isAuthenticated()){
		var id = req.params.comment_id;
		Comment.findById(id,function(err,foundComment){
			if(foundComment.author.id.equals(req.user._id)){
				next();
			}else{
				res.redirect("back");
			}
		});
	}else{
		res.redirect("back");
	}
}


module.exports = middleware_object;