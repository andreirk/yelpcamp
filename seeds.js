var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
         name: "Claud's Rest",
         image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg",
         description: 'bla bla blag'
    },
    {
         name: "Desert Mesa",
         image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
         description: 'bla bla blag'
    },
    {
         name: "Canyon Floor",
         image: "https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg",
         description: 'bla bla blag'
    },
    ]

function seedDB(){
    Campground.remove({}, function(err){
    if(err){
        console.log(err);
    }
    console.log('removed campgrounds');   
    // add a few campgrounds
    data.forEach(function(seed){
        Campground.create(seed, function(err, campground ){
            if (err){
                console.log(err);
            } else {
                console.log('added a campground'); 
                // create a comment
                Comment.create({
                    text: 'This place is great, but i wish there was internet',
                    author: "Homer"
                }, function(err, comment){
                    if(err){
                        console.log(err);
                    } else {
                        campground.comments.push(comment);
                        campground.save();
                        console.log('Created a new comment');
                    }
                })
            }
        }); 
    })
    
})   
}

module.exports = seedDB; 