const Listing = require('../models/listing');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render('listing/index', { allListing });
};                   

module.exports.renderNewForm = (req,res)=>{
    res.render('listing/new.ejs');
}

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


module.exports.createListing= (async (req, res) => {
        let url = req.file.path;
        let filename = req.file.filename;
        
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        await newListing.save();
        console.log(newListing);
        req.flash("success", "Successfully made a new listing");
        res.redirect("/listings");
    });


    module.exports.renderEditForm = (async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
   }
    res.render('listing/edit',{listing});
});

module.exports.updateListing = (async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{... req.body.listing });

    if(typeof req.file !== "undefined"){
     let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename };
    await listing.save();
    }
    req.flash("success", "Updated a listing");
    res.redirect(`/listings/${id}`);
});

module.exports.destroyListing = (async(req,res)=>{
let {id} = req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
req.flash("success", "Deleted a listing");
res.redirect('/listings');
});





