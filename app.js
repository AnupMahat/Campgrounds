
var express 	= require("express"),
	app 		= express(),
	bodyParser	= require("body-parser"),
	mongoose 	= require("mongoose"),
	flash       = require("connect-flash"),
	passport    = require("passport"),
	localStrategy = require("passport-local"),
	methodOverride= require("method-override"),
	Comment 	= require ("./models/comment"),
	Campground	= require("./models/campground"),
	User 		= require("./models/user"),
	seedDB 		= require("./seeds")

var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes		 = require("./routes/index")

mongoose.connect("mongodb+srv://anoop:Letmein01@cluster0.xhjoy.mongodb.net/yelpCamp?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));//for css
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"Once again Rusty wins the cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error= req.flash("error");
	res.locals.success= req.flash("success");
	next();
})


app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



app.listen(process.env.PORT,process.env.IP, function(){
	console.log("Yelp camp Server has Started.............!");
});