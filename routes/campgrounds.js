const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

// ===================
// CAMPGROUNDS ROUTES
// ===================

// INDEX
router.get("/campgrounds", function(req, res){
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
router.post("/campgrounds", isLoggedIn, function(req, res){
    // get data from form
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    // add to DB (helpcamp.campgrounds)
    Campground.create({
        name: name,
        image: image,
        description: description,
        author: author
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
router.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW
router.get("/campgrounds/:id", function(req, res){
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

// CHECK FOR LOGGED IN
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;