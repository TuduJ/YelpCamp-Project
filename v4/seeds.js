var mongoose 	= require("mongoose");
var Campground 	= require("./models/campground");
var Comment		= require("./models/comment")


var data = [
	{
		name: "Cloud's Rest",
		image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Nice and peaceful skyview"
	},
	{
		name: "Forest Den",
		image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Camp in the deep and dark Woods"
	},
	{
		name: "Camp groove",
		image: "https://images.unsplash.com/photo-1520095972714-909e91b038e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Crazy night party and enjoyment, with beautiful stay in the camp"
	},
]


function seedDB(){
// 	Remove all the campgrounds
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("Removed campground!");
			// 	Add some new campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err){
						console.log(err);
					}else{
						console.log("Added a campground");
						Comment.create({
							text: "I wish internet was available",
							author: "Homer"
						}, function(err, comment){
							if(err){
								console.log(err);
							}else{
								campground.comments.push(comment);
								campground.save();
								console.log("Created comment");
							}
						});
					}
				});
			});
		}
	});
	

	
	
// 	Add some comments
	
}


module.exports = seedDB;