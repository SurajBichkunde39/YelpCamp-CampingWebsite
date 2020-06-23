var express       = require("express"),
	bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local"),
	Campground    = require("./models/campground.js"),
	Comment       = require("./models/comment.js"),
	User          = require('./models/user.js'),
	seedDB        = require('./seeds.js');

var uri = "mongodb://localhost:27017/yelp_camp";
mongoose.connect(uri, { useUnifiedTopology: true , useNewUrlParser:true });
mongoose.set('useFindAndModify', false);
seedDB();

var app = express();
app.set("view engine" , "ejs");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true}));


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "India is my country",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});


// =========================================================
// campground routes
// =========================================================

app.get('/',function(req,res){
	res.render("landing",{});
});

//INDEX - List all the campgrounds
app.get('/campgrounds',function(req,res){
	//get all the campgrounds from the database
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:campgrounds});
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
	res.render("campgrounds/new",{});
});


//SHOW - Show info of specific campground
app.get("/campgrounds/:id",function(req,res){
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:foundCampground,});	
		}
	});
});


// =========================================================
// comments routes
// =========================================================

app.get('/campgrounds/:id/comments/new',isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:foundCampground,});	
		}
	});
});

app.post('/campgrounds/:id/comments',isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		}else{
			Comment.create(req.body.comment,function(err,createdcomment){
				if(err){
					console.log(err);
					res.redirect('/campgrounds');
				}else{
					foundCampground.comments.push(createdcomment);
					foundCampground.save(function(err,saved){
						if(err){
							console.log(err);
							res.redirect('/campgrounds');
						}else{
							res.redirect('/campgrounds/'+saved._id);	
						}
					});
				}
			});
			
		}
	});
});

// =========================================================
// Auth routes
// =========================================================

app.get('/register',function(req,res){
	res.render("register");
});


app.post('/register',function(req,res){
	var newUser =  User({username:req.body.username})
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register",{})
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect('/campgrounds');
		});
	});
});

app.get('/login',function(req,res){
	res.render('login',{});
});


app.post('/login',passport.authenticate("local",
		 {
		 	successRedirect:"/campgrounds",
			failureRedirect: "/login",
		 },
	),function(req,res){
	
});


app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/campgrounds');
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect('/login');
	}
}


app.listen(3000,function(){
	console.log("Yelp Camp server has been started");
});
