// REQUIRES
const express    = require("express"),
      app        = express(),
      mongoose   = require('mongoose'),
      Campground = require("./models/campground");

// CONNECT MONGOOSE TO MONGODB
mongoose.connect('mongodb://localhost/yelpcamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// APP SETUP
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

// ROUTES

// ROOT
app.get("/", function(req, res){
    res.render("landing");
});

// INDEX
app.get("/campgrounds", function(req, res){
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log("Error reading campgrounds from DB: " + err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE
app.post("/campgrounds", function(req, res){
    // get data from form
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    // add to DB (helpcamp.campgrounds)
    Campground.create({
        name: name,
        image: image,
        description: description
    }, function(err, campground) {
        if (err) {
            console.log("Error creating campground from form: " + err);
        } else {
            console.log("User added, " + campground.name + " to yelpcamp.campgrounds, with form.");
        }
    });
    // redirect back to campgrounds page
    res.redirect("/campgrounds");
});

// NEW
app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

// SHOW
app.get("/campgrounds/:id", function(req, res){
    // get campground with id from DB
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // render template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

// PORT LISTENING
let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});