const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title:
    {
        type:String,
        required:true
    } ,
    images: 
    {
        default: "https://unsplash.com/photos/swan-swims-on-lake-near-house-and-foggy-mountains-ZIkRtXN3QGw",
        type:String,
        set: (v) => v === "" ?"https://unsplash.com/photos/swan-swims-on-lake-near-house-and-foggy-mountains-ZIkRtXN3QGw" : v,

    },
    description:String,
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
