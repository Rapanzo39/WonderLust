const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title:
    {
        type:String,
        required:true
    } ,
    image: {
    filename: String,
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        set: v =>
            v === ""
                ? "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                : v
    }
},
    description:String,
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
