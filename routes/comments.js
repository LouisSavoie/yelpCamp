const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");


// ===============
// COMMENT ROUTES
// ===============

// NEW COMMENT
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
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
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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
                // add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
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

// EDIT COMMENT
router.get("/campgrounds/:id/comments/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DELETE COMMENT
router.delete("/campgrounds/:id/comments/:comment_id", function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
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