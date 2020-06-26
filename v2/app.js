var express 	= require("express");
var app 		= express();
var bodyParser 	= require("body-parser");
var mongoose 	= require("mongoose");


mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Salmon Creek",
// 		image: "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 		description: "This is a huge Riverside Area. No bathroom, no water. Natural and wild feel."
// 	},
// 	function(err, campground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log("Newly Created Campground: ");
// 			console.log(campground);
// 		}
// 	}
// )





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
			res.render("index", {campgrounds: allCampgrounds});
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
	res.render("new.ejs");
});



app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("show", {campground: foundCampground});
		}
	});
});

 
app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("YelpCamp server has Started!")
});