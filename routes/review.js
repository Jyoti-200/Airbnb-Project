//Express Routers are a way to organize your Express application such that our primary app.js file does not became bloated.
const express = require("express");
const router = express.Router( {mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");  // About Middleware:Err.
// const ExpressError = require("../utils/ExpressError.js");  //About costom express err like status Code & msg.
// const {reviewSchema } = require("../schema.js"); //Handle serverside schema error.

const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewContoller = require("../controllers/reviews.js");

//Reviews -------------------------------------------------
//Post Review Route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewContoller.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewContoller.destroyReview));

module.exports = router;