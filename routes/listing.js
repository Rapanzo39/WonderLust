const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require('../models/listing');
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error)
    {
        let errmsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};


//index route
router.get('/',wrapAsync(async (req,res)=>{
    const allListing = await Listing.find({});
    res.render('listing/index', { allListing });
    
    }));



//new route 
router.get('/new',
     isLoggedIn,
     (req,res)=>{
    res.render('listing/new.ejs');
});


//show route
router.get("/:id",wrapAsync(async(req, res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate('reviews');
   if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
   }
   res.render('listing/show',{listing});
}));

//create route
router.post(
    "/", isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        console.log(newListing);
        req.flash("success", "Successfully made a new listing");
        res.redirect("/listings");
    })
);


//edit route
router.get('/:id/edit',
    isLoggedIn,
    wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
   }
    res.render('listing/edit',{listing});
}));

//update route
router.put('/:id',
    isLoggedIn,
    validateListing, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id,{... req.body.listing });
    req.flash("success", "Updated a listing");
    res.redirect(`/listings/${id}`);
}));


//delete route
router.delete('/:id',isLoggedIn,wrapAsync(async(req,res)=>{
let {id} = req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
req.flash("success", "Deleted a listing");
res.redirect('/listings');
}));

module.exports = router;
