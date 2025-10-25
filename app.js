//app.js
if(process.env.NODE_ENV != "production"){
    // Never Upload dotenv when deploying or posting on git& gihub As it stores are imp credentials
    require('dotenv').config();  
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// FIX 1: Changed to relative path
const ExpressError = require("./utils/ExpressError.js"); 
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
// FIX 2: Changed to relative path
const User = require("./models/user.js"); 


// FIX 3, 4, 5: Changed to relative paths for routers
const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;

//call out function
main()
.then(() => {
    console.log("Connected to db ");
})
.catch((err) => {
    console.log(err);
});

// to connect with mongoose
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
      mongoUrl: dbUrl,
      crypto: {
         secret: process.env.SECRET
      },
      touchAfter: 24*3600,
});
store.on("error", (err) => { // Added 'err' parameter here
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 *24 * 60 * 60 * 1000,
        maxAge: 7 *24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

// app.get("/", (req,res) => {
//     res.send("Hi, I am root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ... (Demouser code commented out) ...

app.use("/listings",listingRouter );
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);

// ... (Error handling middleware) ...

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    console.error(err); // debug log
    if (res.headersSent) {
        return next(err);
    }
    // Assuming you have an error.ejs file in your views directory
    res.status(statusCode).render("error", { message, statusCode }); 
});

app.listen(8080, () =>{
    console.log("Server is listening to port 8080");
});