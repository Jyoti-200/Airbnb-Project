if(process.env.NODE_ENV != "production"){   // This if clause is for jab deploy hoga tab .env file ko upload nehin karna hai.
    require('dotenv').config();
}
//npm i dotenv / for .env ko backend ke sath connect karne ke liye.
//console.log(process.env.SECRET);

//Basic setup -     
const express = require("express");
const app = express();

const mongoose = require("mongoose");

//const Listing = require("./models/listing.js");

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");//To help for creating templating (layout(navbar,footer....))..
app.engine('ejs',ejsMate);

app.use(express.static(path.join(__dirname, "/public")));  //Static file ko access karne ke liye.

//const wrapAsync = require("./utils/wrapAsync.js");  // About Middleware:Err.
const ExpressError = require("./utils/ExpressError.js");  //About costom express err like status Code & msg.

//const { listingSchema, reviewSchema } = require("./schema.js"); //Handle serverside schema error.

const Review = require("./models/reviews.js");
//const { error } = require("console");

const listingRouter  = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo'); //npm i connect-mongo this for internet DB
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//Database setup - 
//let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;            //mongoDB Atlas

main()
.then( () => {
    console.log("connected to db");
})
.catch( (err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create( {       //session info will now saved in (ATLAS)/ setup for AtlasDB..
    mongoUrl: dbUrl, 
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {  //useing session in project.
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};
app.use(session (sessionOptions));
app.use( flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/", (req,res) => {  //Home route
//     res.send("Hi, I am root");
// });

app.use( (req,res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "sigma-student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


// const validateReview = (req,res,next) => {
//     let {error} = reviewSchema.validate(req.body);   //Handle serverside schema error when add a review.
// if (error) {
//  let errMsg = error.details.map( (el) => el.message).join(",");
//  throw new ExpressError(400, errMsg);
// } else {
//  next();
// }
// };


app.use("/listings", listingRouter);  //Parent routes
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// //Reviews ----------------This one is an another folder(routes)..
// //Post Review Route
// app.post("/listings/:id/reviews",validateReview, wrapAsync( async (req, res) => {
//       let listing = await Listing.findById(req.params.id);
//       let newReview = new Review(req.body.review);

//       listing.reviews.push(newReview);
//       await newReview.save();
//       await listing.save();

//       console.log("New Review saved");
//       res.redirect(`/listings/${listing._id}`);

// }));

// //Delete Review Route
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res) => {
//           let {id, reviewId} = req.params;

//           await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
//           await Review.findByIdAndDelete(reviewId);

//           res.redirect(`/listings/${id}`)
// }));

app.all("*", (req,res,next) => {  // if wrong path enter which is not exist then is will show page not found./wrong input.

    next(new ExpressError(404, "Page not Found!"));
});

// app.get("/testlisting", async (req,res) => {
//     let sampleListing = new Listing( {
//         title: "My New villa",
//         description: "By the beach",
//         price:1200,
//         location:"calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.use( (err,req,res,next) => {  // Middleware Err Handling:
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err });
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});