const Listing = require('../models/listing');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const axios = require("axios");

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render('listing/index', { allListing });
};                   

module.exports.renderNewForm = (req,res)=>{
    res.render('listing/new.ejs');
}

//show lisiting
module.exports.showListing = (async(req, res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate({path: 'reviews',
     populate: {path: 'author'}}).populate('owner');

   if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
   }
   res.render('listing/show',{listing});
});

//create listing
module.exports.createListing= (async (req, res) => {
     const { location, country } = req.body.listing;
       const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: `${location}, ${country}`,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "WanderLust/1.0"
            }
        }
    );
    if (response.data.length === 0) {
        req.flash("error", "Location not found!");
        return res.redirect("/listings/new");
    }

    const { lat, lon } = response.data[0];

        let url = req.file.path;
        let filename = req.file.filename;
        
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
         newListing.geometry = {
        type: "Point",
        coordinates: [Number(lon), Number(lat)]
    };
        await newListing.save();
        console.log(newListing);
        req.flash("success", "Successfully made a new listing");
        res.redirect("/listings");
    });

//edit form 
    module.exports.renderEditForm = (async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
   }

   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250");
    res.render('listing/edit',{listing,originalImageUrl});
});


//update listing
module.exports.updateListing = (async(req,res)=>{
    const {id} = req.params;
     // Find the existing listing
    const listing = await Listing.findById(id);

    // Store old location and country
    const oldLocation = listing.location;
    const oldCountry = listing.country;

    // Update normal listing fields
    Object.assign(listing, req.body.listing);

    // Only update coordinates if location or country changed
    if (
        oldLocation !== listing.location ||
        oldCountry !== listing.country
    ) {
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: `${listing.location}, ${listing.country}`,
                    format: "jsonv2",
                    limit: 1
                },
                headers: {
                    "User-Agent": "WanderLust/1.0"
                }
            }
        );

        if (response.data.length === 0) {
            req.flash("error", "Location not found!");
            return res.redirect(`/listings/${id}/edit`);
        }

        const { lat, lon } = response.data[0];

        listing.geometry = {
            type: "Point",
            coordinates: [Number(lon), Number(lat)]
        };
    }
      //Update image only if a new image is uploaded
       if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    //  if(typeof req.file !== "undefined"){
    //  let url = req.file.path;
    // let filename = req.file.filename;
    // listing.image = {url, filename };

    //save everthing once
    await listing.save();
    
    req.flash("success", "Updated a listing");
    res.redirect(`/listings/${id}`);
});


//delete listing
module.exports.destroyListing = (async(req,res)=>{
let {id} = req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
req.flash("success", "Deleted a listing");
res.redirect('/listings');
});





