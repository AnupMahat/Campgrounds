var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ALL THE MIDDLEWARE GOES HERE

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err,foundCampground){
		if(err){
			res.redirect("back");
		}else{
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			}else{
				res.redirect("back");
			}
			//does user own campgrounds?
			//render show template with that campground
		}
	});
	}else{
		res.redirect("back");
	}
}


middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err,foundComment){
		if(err){
			req.flash("error", "Campground not found");
			res.redirect("back");
		}else{
			//does user own the comment?
			if(foundComment.author.id.equals(req.user._id)){
				next();
			}else{
				req.flash("error", "You don't have premossion to do that");
				res.redirect("back");
			}
			//does user own campgrounds?
			//render show template with that campground
		}
	});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}


module.exports = middlewareObj