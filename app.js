var express = require("express"), 
    app = express(), 
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose"),
    //User = require("./models/user"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    Campground = require("./models/campground");

seedDB();    
mongoose.connect('mongodb://' + process.env.IP + '/yelp_camp');
 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('landing');
});


app.get('/campgrounds', function(req, res){
    
        Campground.find({}, function(err, campgrounds){
            if(err){
                console.log(err);
            } else {
                res.render('campgrounds/index', {campgrounds:campgrounds});
            }
        })
})


app.post('/campgrounds',  function(req,res){
   // get date from form and add to campgrounds array
   // redirect back to campgrounds page
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var newCampground = {
        name : name,
        image: image,
        description: description
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


app.get('/campgrounds/new', function(req, res) {
   res.render('campgrounds/new');  
});


app.get('/campgrounds/:id', function(req, res) {
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

// ==========================================
// COMMENTS ROUTES
// ==========================================

app.get('/campgrounds/:id/comments/new', function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {campground: foundCampground})
        }
    })
})

app.post('/campgrounds/:id/comments', function(req, res){
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
    // create new comment
    // connect new comment to campground
    // redirect
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('The YelpCamp Has started!');
});

