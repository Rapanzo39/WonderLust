const mongoose = require("mongoose");
const express = require("express");
const app = express();

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");

const listings = require("./routes/listing.js");   
const reviews = require("./routes/review");     


const MONGO_URI = 'mongodb://localhost:27017/wonderlust';




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));





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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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


