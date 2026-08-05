const Listing = require("./models/listing.js");
const Review = require("./models/review");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) => { 

      if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();

};

module.exports.savedRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
       
    }
    next();
};

module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not authorized to perform this action");
       return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error)
    {
        let errmsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};


module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error)
    {
        let errmsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author of this review");
       return res.redirect(`/listings/${id}`);//return is called to stop the execution of this code.
        // if user is not the owner of this listing. 
        // If we don't use return, the next() function will be called 
        // and the user will be able to delete the listing even if he is not the owner.
    }
    next();
};

