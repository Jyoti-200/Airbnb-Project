const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
   
    req.flash("success", "New Review Created!");
    console.log("New Review saved");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req,res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
//Mongo $pull Operator - $pull - The $pull operator removes from on existing array all instance of values that match a specified conditon.
    
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`)
};