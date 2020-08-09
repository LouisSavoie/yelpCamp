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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
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
    res.redirect("/campgrounds");
});

// CHECK FOR LOGGED IN
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;