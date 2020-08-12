const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// ROOT
router.get("/", function(req, res){
    res.render("landing");
});

// ===============
//  AUTH ROUTES
// ===============

// REGISTER FORM
router.get("/register", function(req, res){
    res.render("register");
});

// POST REGISTRATION
router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
});

// POST LOGIN
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have been logged out.")
    res.redirect("/campgrounds");
});

module.exports = router;