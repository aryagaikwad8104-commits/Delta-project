const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("C:\\Users\\aryag\\MAJORPROJECT\\utils\\wrapAsync.js");
const ExpressError = require("C:\\Users\\aryag\\MAJORPROJECT\\utils\\ExpressError.js");
const Review = require("C:\\Users\\aryag\\MAJORPROJECT\\models\\reviews.js");
const Listing = require("C:\\Users\\aryag\\MAJORPROJECT\\models\\listing.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("C:\\Users\\aryag\\MAJORPROJECT\\middleware.js");
const reviewController = require("C:\\Users\\aryag\\MAJORPROJECT\\controllers\\reviews.js");



//reviews
//POST ROUTE
router.post("/",
    validateReview,wrapAsync (reviewController.createReview));

//Delete Reviews Route

router.delete("/:reviewId",
  isLoggedIn,
  isreviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
