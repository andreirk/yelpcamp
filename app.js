var express = require("express"), 
    app = express(), 
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose");
    
mongoose.connect('mongodb://' + process.env.IP + '/yelp_camp');
 
var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundsSchema);

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
                res.render('index', {campgrounds:campgrounds});
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
   res.render('new');  
});


app.get('campgrounds/:id', function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id, function(err, FoundCampground){
        if(err){
            console.log(err);
        } else {
            res.render('show', {campground: FoundCampground});
        }
    });
    res.send('This will be the show page one day!');
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('The YelpCamp Has started!');
});

