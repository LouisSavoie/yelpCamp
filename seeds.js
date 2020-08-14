// REQUIRES
const mongoose   = require("mongoose"),
      Campground = require("./models/campground"),
      Comment    = require("./models/comment");
const User = require("./models/user");

async function seedDB(){
    // Delete Comments
    await Comment.deleteMany({});
    console.log("Seed: Comments Removed");
    // Delete Campgrounds
    await Campground.deleteMany({})
    console.log("Seed: Campgrounds Removed");
    // Delete Users
    await User.deleteMany({});
    console.log("Seed: Users Removed");
    // Create User
    let newUser = new User({username: "testbot"});
    let password = "testy!";
    await User.register(newUser, password);
    console.log("Seed: User(testbot) Created");
    let testbot = await User.findOne({username: "testbot"});

    // Campgrounds Data (I know this is not good practice, it's just for testing.)
    let campSeeds = [
        {
            name: "Cloud's Rest", 
            image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
            price: "5",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            author: {id: testbot._id, username: testbot.username}
        },
        {
            name: "Desert Mesa", 
            image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
            price: "12",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            author: {id: testbot._id, username: testbot.username}
        },
        {
            name: "Canyon Floor", 
            image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
            price: "20",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            author: {id: testbot._id, username: testbot.username}
        }
    ];

    // Comments Data (I know this is not good practice, it's just for testing.)
    let commentSeeds = [
        {
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            author: {id: testbot._id, username: testbot.username}
        },
        {
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            author: {id: testbot._id, username: testbot.username}
        },
        {
            text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            author: {id: testbot._id, username: testbot.username}
        }
    ]

    // Create Campgrounds with Comments by User
    for(const seedCamp of campSeeds){
        // Create Campground
        let campground = await Campground.create(seedCamp);
        console.log("Seed: Campground Created");
        for(const seedComment of commentSeeds){
            // Create Comment
            let comment = await Comment.create(seedComment);
            console.log("Seed: Comment Created");
            campground.comments.push(comment);
        }
        campground.save();
        console.log("Seed: Comment added to Campground");
    }
};

module.exports = seedDB;