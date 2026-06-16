const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title:
    {
        type:String,
        required:true
    } ,
    image: 
    {
      filename: String,
     url: String
   },
    description:String,
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
