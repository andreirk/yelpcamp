
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
                    // add username and id to comments and save comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
            })
        }
    })

});

// COMMENTS EDIT ROUTE
router.get('/campgrounds/:id/comments/:comment_id/edit', checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});    
        }
    });
  
});

// COMMENTS UPDATE
router.put('/campgrounds/:id/comments/:comment_id/',checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

// DESTROY ROUTE
router.delete('/campgrounds/:id/comments/:comment_id',checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect('back');
       } else {
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
})


function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back');
        } else {
            if (foundComment.author.id.equals(req.user._id)){
                 next();  
            } else {
                res.redirect('back');
              }
                     
            }
        });
    } else {
        res.redirect('back');
    }
}


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;