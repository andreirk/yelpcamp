var express = require("express"), 
    app = express(), 
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose"),
    passport = require('passport'),
    LocalStratagy = require("passport-local"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    User   = require("./models/user"),
    Campground = require("./models/campground");

var commentRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
  
mongoose.connect('mongodb://' + process.env.IP + '/yelp_camp');
 
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

seedDB();  

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: 'anything you want!',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.use(indexRoutes);
app.use(campgroundsRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('The YelpCamp Has started!');
});

