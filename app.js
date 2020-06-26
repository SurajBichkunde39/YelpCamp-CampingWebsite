var express       = require("express"),
	bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"),
	passport      = require("passport"),
	flash         = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	methodOverride= require("method-override");
	Campground    = require("./models/campground.js"),
	Comment       = require("./models/comment.js"),
	User          = require('./models/user.js'),
	seedDB        = require('./seeds.js');


var commentRoutes      = require('./routes/comments.js'),
	campgroundRoutes   = require('./routes/campgrounds.js'),
	indexRoutes        = require('./routes/index.js');


mongoose.connect(process.env.DATABASEURL, { useUnifiedTopology: true , useNewUrlParser:true });
console.log("env database url ", process.env.DATABASEURL);
// mongoose.connect("mongodb+srv://SurajBichkunde:Suraj@39@yelpcamp-iowmn.mongodb.net/<dbname>?retryWrites=true&w=majority", { useUnifiedTopology: true , useNewUrlParser:true });
mongoose.set('useFindAndModify', false);
// seedDB();

var app = express();
app.set("view engine" , "ejs");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



app.use('/',indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);



app.listen(process.env.PORT||3000,function(){
	console.log("Yelp Camp server has been started");
});
