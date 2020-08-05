var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/",function(req, res){
	//get al campgrounds from db
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser: req.user});
		}
	})
});

//CREATE - Add new campground to databaase
router.post("/",middleware.isLoggedIn, function(req,res){
	//get data from form and add to camp grounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: description, author:author}
	//create a new campground and save to database
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect to campgrounds page
		res.redirect("/campgrounds");
		}
	});
	
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//SHOW -  shows more info about one campground
router.get("/:id", function(req,res){
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
	
		Campground.findById(req.params.id, function(err,foundCampground){
				res.render("campgrounds/edit", {campground: foundCampground});
		});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	//find and update correct campgrounds
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect to show page
})

//destroy campground	
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err,campgroundRemoved){
		if(err){
			res.redirect("/campgrounds");
		}else{
			Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, function(err, deletedComments){
				if(err){
					console.log(err);
				}else{
					res.redirect("/campgrounds");
				}
			})
		}
	});
});



module.exports = router;