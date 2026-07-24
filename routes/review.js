
const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require("../models/review");
const Listing = require("../models/listing");

const {validateReview} = require("../middleware.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//review
//post review route
router.post('/',
    isLoggedIn,
    validateReview,
     wrapAsync(reviewController.createReview));


//delete review route
router.delete('/:reviewId',
     isLoggedIn,
     isReviewAuthor,
     wrapAsync(reviewController.deleteReview));

module.exports = router;

