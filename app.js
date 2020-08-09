// REQUIRES
const express       = require("express"),
      app           = express(),
      mongoose      = require('mongoose'),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      User          = require("./models/user"),
      seedDB        = require("./seeds");

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
app.use(express.static(__dirname + "/public"));

seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Hello, Gordon! Another day another dollar, am I right? Hahaha.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===================
// CAMPGROUNDS ROUTES
// ===================

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
    res.render("campgrounds/new");
});

// SHOW
app.get("/campgrounds/:id", function(req, res){
    // get campground with id from DB
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // render template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// ===============
// COMMENT ROUTES
// ===============

// NEW COMMENT
app.get("/campgrounds/:id/comments/new", function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            // render the new comment form
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE COMMENT
app.post("/campgrounds/:id/comments", function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
          // create new comment
          Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                // connect new comment to campground
                campground.comments.push(comment);
                campground.save();
                // redirect to campground show page
                res.redirect("/campgrounds/" + campground._id);
            }
          });
        }
    });
});

// ===============
//  AUTH ROUTES
// ===============

// REGISTER FORM
app.get("/register", function(req, res){
    res.render("register");
});

// POST REGISTRATION
app.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// PORT LISTENING
let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});