var express 			= require("express");
var app 				= express();
var bodyParser 			= require("body-parser");
var mongoose 			= require("mongoose");
var passport			= require("passport");
var LocalStrategy		= require("passport-local");
var Campground			= require("./models/campground");
var Comment				= require("./models/comment");
var User				= require("./models/user");
var seedDB				= require("./seeds");


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "we reached secret page",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/yelp_camp_v6");
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", {useNewUrlParser: true, useUnifiedTopology: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public")); 

seedDB();








// var campgrounds = [
// 		{name: "Salmon Creek", image: "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Granite Hill", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Blue Moon View", image: "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Cool Lagoon", image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
// 	]


app.get("/", function(req, res){
	res.render("landing");
});


// INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res){
// 	Get all the campgrounds from DB 
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});


// CREATE - Add new campgrounds to the database
app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc}
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
// 			Redirect back to Campgrounds page
			res.redirect("/campgrounds");
		}
	})
});



// NEW - Show form to add new campground
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});


// SHOW - Dhow details page of the campground
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


// ====================
// COMMENT ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
// 	find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});


app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id)
				}
			});
		}
	});
});



// ==============
// AUTH ROUTES
// ==============

app.get("/register", function(req, res){
	res.render("register");
})

// Handle sign up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});


// show login form
app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){
	
});

// logout route

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});



function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

 
app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("YelpCamp server has Started!")
});