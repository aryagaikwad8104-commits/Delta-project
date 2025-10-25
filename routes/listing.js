const express = require("express");
const router = express.Router();
// const wrapAsync = require("C:\\Users\\aryag\\MAJORPROJECT\\utils\\wrapAsync.js");
// routes/listing.js

// Change the path for wrapAsync to go up one level (..) then into utils
const wrapAsync = require("../utils/wrapAsync.js"); 
const Listing = require("C:\\Users\\aryag\\MAJORPROJECT\\models\\listing.js");
const {isLoggedIn,isOwner,validateListing} = require("C:\\Users\\aryag\\MAJORPROJECT\\middleware.js");

const listingController = require("C:\\Users\\aryag\\MAJORPROJECT\\controllers\\listings.js");
const multer  = require('multer');
const {storage} = require("C:\\Users\\aryag\\MAJORPROJECT\\cloudConfig.js");
const upload = multer({ storage });


router.
route("/")
//Index Route
.get( wrapAsync(listingController.index))
//Create Route
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing));

//NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
//Show Route
.get( wrapAsync(listingController.showListing))
//Update Route
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
//Delete Route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;
