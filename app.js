// REQUIRES
const express        = require("express"),
      app            = express(),
      mongoose       = require('mongoose'),
      flash          = require("connect-flash"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      Campground     = require("./models/campground"),
      Comment        = require("./models/comment"),
      User           = require("./models/user"),
      seedDB         = require("./seeds");

// REQUIRE ROUTES
const campgroundRoutes = require("./routes/campgrounds"),
      commentsRoutes   = require("./routes/comments"),
      indexRoutes      = require("./routes/index");

// CONNECT MONGOOSE TO MONGODB
mongoose.connect(process.env.DATABASEURL || 'mongodb://localhost/yelpcamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

mongoose.set('useFindAndModify', false);

// APP SETUP
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// SEED THE DATABASE WITH DUMMY DATA
//seedDB();

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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// USE ROUTES
app.use(campgroundRoutes);
app.use(commentsRoutes);
app.use(indexRoutes);

// PORT LISTENING
let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});