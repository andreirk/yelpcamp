
var express = require("express");
var router = express.Router();
var   Comment = require("../models/comment"),
      User   = require("../models/user"),
      Campground = require("../models/campground");
// INDEX show all campgrounds

router.get('/campgrounds', function(req, res){
    
        Campground.find({}, function(err, campgrounds){
            if(err){
                console.log(err);
            } else {
                res.render('campgrounds/index', {campgrounds:campgrounds});
            }
        })
})


router.post('/campgrounds', isLoggedIn, function(req,res){
   // get date from form and add to campgrounds array
   // redirect back to campgrounds page
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username 
   }
   var newCampground = {
        name : name,
        image: image,
        description: description,
        author:author
        };
    Campground.create(
        newCampground,
        function(err, campground){
            if(err){
                console.log(err);
            } else {
                 res.redirect('/campgrounds');
            }
        }
    );
});


router.get('/campgrounds/new', isLoggedIn, function(req, res) {
   res.render('campgrounds/new');  
});


router.get('/campgrounds/:id', function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, FoundCampground){
        if(err){
            console.log(err);
        } else {
            console.log('before show' + FoundCampground );
            res.render('campgrounds/show', {campground: FoundCampground});
        }
    });
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;