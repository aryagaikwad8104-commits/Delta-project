const Listing = require("C:\\Users\\aryag\\MAJORPROJECT\\models\\listing.js");
const Review = require("C:\\Users\\aryag\\MAJORPROJECT\\models\\reviews.js");
const ExpressError = require("C:\\Users\\aryag\\MAJORPROJECT\\utils\\ExpressError.js");
const {listingSchema,reviewSchema} = require("C:\\Users\\aryag\\MAJORPROJECT\\schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()){
          req.session.redirectUrl = req.originalUrl;
          req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/Login");
 } 
 next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
   let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", " You dont have the permission to update!!");
   return  res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.validateListing = (req,res,next) => {
    let {error} =  listingSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
   }
   else{
    next();
   }
}; 

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// module.exports.isreviewAuthor = async(req,res,next) => {
//    let {id,reviewId} = req.params;
//   let review = await Review.findById(reviewId);
//   if(!review.author.equals(res.locals.currUser._id)){
//     req.flash("error", " You didn't create this review!");
//    return  res.redirect(`/listings/${id}`);
//   }

//   next();
// };

module.exports.isreviewAuthor = async (req, res, next) => {
  try {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect(`/listings/${id}`);
    }

    if (!res.locals.currUser) {
      req.flash("error", "You must be logged in!");
      return res.redirect("/Login");
    }

    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You didn't create this review!");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    next(err);
  }
};
