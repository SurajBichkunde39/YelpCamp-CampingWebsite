var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var uri = "mongodb://localhost:27017/yelp_camp";
mongoose.connect(uri, { useUnifiedTopology: true , useNewUrlParser:true });
mongoose.set('useFindAndModify', false);


var app = express();
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}));



//SCHMEA
var campgroundSchema = new mongoose.Schema({
	name:String,
	img:String,
	description:String,
});
var Campground = mongoose.model("campground",campgroundSchema);

// Campground.create({
// 	name:"Sushi Hill!",
// 	img:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	description:"I guess we could discuss the implications of the phrase 'meant to be.' That is if we wanted to drown ourselves in a sea of backwardly referential semantics and other mumbo-jumbo. Maybe such a discussion would result in the determination that 'meant to be' is exactly as meaningless a phrase as it seems to be, and that none of us is actually meant to be doing anything at all. But that's my existential underpants underpinnings showing. It's the way the cookie crumbles. And now I want a cookie."
// },function(err,campground){
// 	if(err){
// 		console.log("Something went wromg");
// 		console.log(err);
// 	}else{
// 		console.log("added sucessdully");
// 	}
// });

app.get('/',function(req,res){
	res.render("landing");
});

//INDEX - List all the campgrounds
app.get('/campgrounds',function(req,res){
	//get all the campgrounds from the database
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("index",{campgrounds:campgrounds});
		}
	});
});

//CREATE - Create the new campground
app.post("/campgrounds",function(req,res){
	var name = req.body.name;
	var img = req.body.img;
	var description = req.body.description;
	var newCampfround = {
		name:name,
		img:img,
		description:description,
	}
	//add newly created campgrounds to the database
	Campground.create(newCampfround,function(err,newCampfround){
		if(err){
			console.log(err);
		}else{
			res.redirect('/campgrounds');
		}
	});
});


//NEW - take info about new campground
app.get("/campgrounds/new",function(req,res){
	res.render("newcampground");
});


//SHOW - Show info of specific campground
app.get("/campgrounds/:id",function(req,res){
	var id = req.params.id;
	Campground.findById(id,function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("show",{campground:foundCampground});	
		}
	});
});

app.listen(3000,function(){
	console.log("Yelp Camp server has been started");
});
