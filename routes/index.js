var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
	res.render("landing");
});

//===============
///AUTH ROUTES
//===============

//show register route
router.get("/register", function(req,res){
	res.render("register");
});

//HANDLE SIGNUP LOGIC
router.post("/register", function(req, res){
	var newUser = new User({username:req.body.username})
	User.register(newUser,req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			res.redirect("/register");
		}else{
			passport.authenticate("local")(req,res, function(){
				req.flash("success", "Welcome to YelpCamp"+ user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});

//SHOW LOGIN FORM
router.get("/login", function(req,res){
	res.render("login");
});

//HANDLE LOGIN LOGIC
router.post("/login",passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req,res){	
});

//logout route
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "logged you out");
	res.redirect("/campgrounds");
});



module.exports = router;