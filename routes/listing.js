const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require('../models/listing');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer = require('multer');
const upload = multer({ dest:'uploads/' });

router
.route("/")
.get( wrapAsync(listingController.index))
// .post(isLoggedIn,
//     validateListing,
//     wrapAsync, (listingController.createListing)
// );
.post(upload.single('listing[image]'),(req,res) =>{
    console.log(req.file);
    res.send(req.file);
})


//new route 
router.get('/new',isLoggedIn, listingController.renderNewForm);


router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync,(listingController.destroyListing));



//edit route
router.get('/:id/edit',
    isLoggedIn, isOwner,
    wrapAsync (listingController.renderEditForm));



module.exports = router;
