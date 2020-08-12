const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");


// ===============
// COMMENT ROUTES
// ===============

// NEW COMMENT
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Comment not found.");
            console.log(err);
        } else {
            // render the new comment form
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE COMMENT
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Comment not found.");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
          // create new comment
          Comment.create(req.body.comment, function(err, comment){
            if(err){
                req.flash("error", "Something went wrong.");
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
                req.flash("success", "Comment added!");
                res.redirect("/campgrounds/" + campground._id);
            }
          });
        }
    });
});

// EDIT COMMENT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", "Something went wrong.");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Something went wrong.");
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DELETE COMMENT
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Something went wrong.");
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;