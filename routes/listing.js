const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require('../models/listing');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//category filter route
router.get("/filter/:category", async (req, res) => {
    console.log("filter route hit");
    let { category } = req.params;
    // console.log(category);
    let allListing = await Listing.find({ category });
    // console.log(allListing);
    res.render("listing/index.ejs", { allListing });
});

// SEARCH ROUTE
router.get("/search", async (req, res) => {

    let query = req.query.q;

    let allListing = await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } }
        ]
    });

    res.render("listing/index.ejs", { allListing });
});

     // MY LISTING ROUTES
router.get("/mylistings", isLoggedIn, async (req, res) => {
    console.log("MY LISTINGS ROUTE HIT");

    const listings = await Listing.find({
        owner: req.user._id
    });

    res.render("listing/mylistings", { listings });

});

//index route
router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);


//new route 
router.get('/new',isLoggedIn, listingController.renderNewForm);

//edit route
router.get('/:id/edit',
    isLoggedIn, isOwner,
    wrapAsync (listingController.renderEditForm));


//show, update, delete route
router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, 
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn, isOwner, wrapAsync,(listingController.destroyListing));


module.exports = router;
