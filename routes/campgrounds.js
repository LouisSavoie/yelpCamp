const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const campground = require("../models/campground");
const middleware = require("../middleware");

// ===================
// CAMPGROUNDS ROUTES
// ===================

// INDEX
router.get("/campgrounds", function(req, res){
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
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
            req.flash("error", "Something went wrong.");
            res.redirect("back");
        } else {
            req.flash("success", "Campground has been created.");
            console.log("User added, " + campground.name + " to yelpcamp.campgrounds, with form.");
        }
    });
    // redirect back to campgrounds page
    res.redirect("/campgrounds");
});

// NEW
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW
router.get("/campgrounds/:id", function(req, res){
    // get campground with id from DB
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            req.flash("error", "Campground not found.");
            console.log(err);
        } else {
            // render template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found.");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find campground then update it
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Campground not found.");
            res.redirect("/campgrounds");
        } else {
            // redirect to the show page of campground
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            req.flash("error", "Campground not found.");
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;