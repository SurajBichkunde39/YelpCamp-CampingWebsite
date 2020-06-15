var express = require("express");
var bodyParser = require("body-parser");


var app = express();
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}));

campgrounds = [
	{
		name:"Raygad fort",
		img:"https://pixabay.com/get/57e8d1464d53a514f1dc84609620367d1c3ed9e04e507440772e7add934ac5_340.jpg",
	},
	{
		name:"Lonavla",
		img:"https://pixabay.com/get/52e3d3404a55af14f1dc84609620367d1c3ed9e04e507440772e7add934ac5_340.png",
	},
	{
		name:"Kalsubai",
		img:"https://pixabay.com/get/54e5dc474355a914f1dc84609620367d1c3ed9e04e507440772e7add934ac5_340.jpg",
	},
]


app.get('/',function(req,res){
	res.render("landing");
});

app.get('/campgrounds',function(req,res){
	res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds",function(req,res){
	var name = req.body.name;
	var img = req.body.img;
	var newCampfround = {
		name:name,
		img:img,
	}
	campgrounds.push(newCampfround);
	res.redirect('/campgrounds');
});

app.get("/campgrounds/new",function(req,res){
	res.render("newcampground");
});

app.listen(3000,function(){
	console.log("Yelp Camp server has been started");
});
