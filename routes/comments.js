
// ==========================================
// COMMENTS ROUTES
// ==========================================

var express = require("express");
var router = express.Router();
var   Comment = require("../models/comment"),
      User   = require("../models/user"),
      Campground = require("../models/campground");
      
router.get('/campgrounds/:id/comments/new',isLoggedIn,  function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {campground: foundCampground})
        }
    })
})

router.post('/campgrounds/:id/comments',isLoggedIn, function(req, res){
    // lookup campground using id
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
            })
        }
    })

});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;