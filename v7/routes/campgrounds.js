var express 	= require("express");
var router 		= express.Router();

var Campground 	= require("../models/campground");

// INDEX - Show all campgrounds
router.get("/", function(req, res){
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
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
	res.render("campgrounds/new");
});


// SHOW - Dhow details page of the campground
router.get("/:id", function(req, res){
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

module.exports = router;