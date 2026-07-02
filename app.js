const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Listing = require('./models/listing');
const initData = require('./init/data.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const MONGO_URI = 'mongodb://localhost:27017/wonderlust';
const Review = require("./models/review.js");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

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


const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error)
    {
        let errmsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};

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
app.get('/listings',wrapAsync(async (req,res)=>{
    const allListing = await Listing.find({});
    res.render('listing/index', { allListing });
    
    }));


//new route to show form to create new listing
app.get('/listings/new', (req,res)=>{
    res.render('listing/new');
});



//show route
app.get("/listings/:id",wrapAsync(async(req, res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate('reviews');
   res.render('listing/show',{listing});
}));

//create route
app.post('/listings',validateListing, wrapAsync(async(req,res,next)=>{
    
        let result = listingSchema.validate(req.body);
        console.log(result);
        if(result.error)
        {
            throw new ExpressError(400, result.error);
        }
        await newListing.save();
        console.log(newListing);
        //console.log(req.body);
        res.redirect("listings"); 
}));


//edit route
app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listing/edit',{listing});
}));

//update route
app.put('/listings/:id',validateListing, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id,{... req.body.listing });
    res.redirect(`/listings/${id}`);
}));


//delete route
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
let {id} = req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect('/listings');
}));

//review
//post route
app.post('/listings/:id/reviews',
    validateReview,
     wrapAsync(async(req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review); 

   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();

   res.redirect(`/listings/${listing._id}`);
}));


//delete review route
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

app.use((req,res,next)=>{
    next(new ExpressError(404 , "Page Not Found!"));
});


app.use((err,req,res,next)=>{
    let {statusCode = 500, message="Somthing went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
});


app.listen(3000, () =>{
    console.log('Server is running on port 3000');
});