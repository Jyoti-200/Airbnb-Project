//Express Routers are a way to organize your Express application such that our primary app.js file does not became bloated.
const express = require("express");  
const router = express.Router();   //Creates new router object.

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");  // About Middleware:Err.

const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingContoller = require("../controllers/listings.js");
const multer = require('multer');    //form ke data ko parse karne ke liye
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });   //(dest: 'uploads/')form ke data se file ko nikalega & uploads nam ka folder me save karega.

router           //A way to group together routes with different verbs but same path.     
.route("/")
.get(wrapAsync(listingContoller.index) )                  //This is index route
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync (listingContoller.createListing));       //This is create route

//As the same way we can write show,update,delete route coz these are belongs to same path. router.route(/:id)...


//Index Route
//router.get("/", wrapAsync(listingContoller.index) );
//      async (req,res) => {
//     const  allListings = await Listing.find({});   //These code are moved into the controller folder.(MVC implement for Listings).
//     res.render("listings/index.ejs",{allListings});
// });

// New  Route  - form
 router.get("/new",isLoggedIn,listingContoller.renderNewForm );
//(req,res) => {
//  res.render("listings/new.ejs");  //Thse are also moved....
// });

//Create Route - and save DB
// router.post("/",isLoggedIn, validateListing, wrapAsync (listingContoller.createListing));

//Show Route - specific listing data (view).
router.get("/:id",wrapAsync(listingContoller.showListing) );

//Edit Route -form
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingContoller.renderEditForm));


//Update Route
router.put("/:id",isLoggedIn,upload.single("listing[image]"),isOwner,validateListing, wrapAsync(listingContoller.updateListing));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingContoller.destroyListing));

module.exports = router;