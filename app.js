var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var seedDB = require('./seeds.js');

var uri = "mongodb://localhost:27017/yelp_camp";
mongoose.connect(uri, { useUnifiedTopology: true , useNewUrlParser:true });
mongoose.set('useFindAndModify', false);
seedDB();

var app = express();
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}));

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
	Campground.findById(id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("show",{campground:foundCampground});	
		}
	});
});

app.listen(3000,function(){
	console.log("Yelp Camp server has been started");
});
