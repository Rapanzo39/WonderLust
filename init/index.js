if(process.env.NODE_ENV != "production")
{
    require('dotenv').config();
}

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Listing = require('../models/listing');
const initData = require('./data.js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// const MONGO_URI = 'mongodb://localhost:27017/wonderlust';
const dbUrl = process.env.ATLASDB_URL;

main()
.then(async ()=>{
    console.log('Database connection successful');
    await initDB();
    mongoose.connection.close();
}).catch((err)=>{
    console.error('Database connection error', err);
})
async function main() {
    await mongoose.connect(dbUrl);
}   

const initDB = async () => {
    
        await Listing.deleteMany({});
           initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a6a3c4aa178c13ed734c4eb"
    }));
        await Listing.insertMany(initData.data);
        console.log('Database initialized with sample data');   
}; 


