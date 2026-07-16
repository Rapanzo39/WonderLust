const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Listing = require('../models/listing');
const initData = require('./data.js');

const MONGO_URI = 'mongodb://localhost:27017/wonderlust';

main()
.then(async ()=>{
    console.log('Database connection successful');
    await initDB();
    mongoose.connection.close();
}).catch((err)=>{
    console.error('Database connection error', err);
})
async function main() {
    await mongoose.connect(MONGO_URI);
}   

const initDB = async () => {
    
        await Listing.deleteMany({});
           initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a577a2e5d528a1396fbc415"
    }));
        await Listing.insertMany(initData.data);
        console.log('Database initialized with sample data');   
};  