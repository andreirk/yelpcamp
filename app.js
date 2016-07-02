var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
            {
                name: 'Salmon Greek', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR8g4PCYI2ssAVPKlJmC9q4T_k84PE7zOHqAWultSDb-BbSy5YfK-5P0I1f'
            },
            {
                name: 'Grantee Hill', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR8g4PCYI2ssAVPKlJmC9q4T_k84PE7zOHqAWultSDb-BbSy5YfK-5P0I1f'
            },
            {
                name: "Mountain Gaat's Rest", image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR8g4PCYI2ssAVPKlJmC9q4T_k84PE7zOHqAWultSDb-BbSy5YfK-5P0I1f'
            }
        ]
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');



app.get('/', function(req, res){
    res.render('landing');
});


app.get('/campgrounds', function(req, res){
    
        
        res.render('campgrounds', {campgrounds:campgrounds});
        
       
})


app.post('/campgrounds',  function(req,res){
   // get date from form and add to campgrounds array
   // redirect back to campgrounds page
   var name = req.body.name;
   var image = req.body.image;
   
   campgrounds.push({name:name, image:image });
   res.redirect('/campgrounds');
   
});


app.get('/campgrounds/new', function(req, res) {
   res.render('new');  
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('The YelpCamp Has started!');
});

