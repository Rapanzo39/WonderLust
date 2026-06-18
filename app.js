const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Listing = require('./models/listing');
const initData = require('./init/data.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
const MONGO_URI = 'mongodb://localhost:27017/wonderlust';

main()
.then(()=>{
    console.log('Database connection successful');
}).catch((err)=>{
    console.error('Database connection error', err);
})
async function main() {
    await mongoose.connect(MONGO_URI);
}

app.get('/', (req,res)=>{
    res.send("root route");
});

//index route
app.get('/listings',async (req,res)=>{
    const allListing = await Listing.find({});
    res.render('listing/index', { allListing });
    
    });


//new route to show form to create new listing
app.get('/listings/new', (req,res)=>{
    res.render('listing/new');
});



//show route
app.get("/listings/:id",async(req, res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render('listing/show',{listing});
});

//create route
app.post('/listings',async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    //console.log(req.body);
    res.redirect("listings");  
});


//edit route
app.get('/listings/:id/edit',async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listing/edit',{listing});
});

//update route
app.put('/listings/:id',async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id,{... req.body.listing });
    res.redirect(`/listings/${id}`);
});


//delete route
app.delete('/listings/:id',async(req,res)=>{
let {id} = req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect('/listings');
});


app.listen(3000, () =>{
    console.log('Server is running on port 3000');
});