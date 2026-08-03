if(process.env.NODE_ENV != "production")
{
    require('dotenv').config();
}

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const listingsRouter = require("./routes/listing.js");   
const reviewsRouter = require("./routes/review"); 
const userRouter = require("./routes/user.js");    
const session = require("express-session");
const MongoStore = require('connect-mongo').default;

const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const wishlistRouter = require("./routes/wishlist");
// const Booking = require("./models/booking");
const bookingRouter = require("./routes/booking.js");
const legalRouter = require("./routes/legal");

const dbUrl = process.env.ATLASDB_URL;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));



const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionconfig = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    } ,
};


app.use(session(sessionconfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.flashMessages = req.flash("success");
    res.locals.errorMessages = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});



main()
.then(()=>{
    console.log('Database connection successful');
}).catch((err)=>{
    console.error('Database connection error', err);
})
async function main() {
    await mongoose.connect(dbUrl);
}

// app.get('/', (req,res)=>{
//     res.send("root route");
// });


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/bookings", bookingRouter);
app.use("/wishlist", wishlistRouter);
app.use("/legal", legalRouter);
app.use("/", userRouter);


app.use((req,res,next)=>{
    next(new ExpressError(404 , "Page Not Found!"));
});


app.use((err,req,res,next)=>{
    let {statusCode = 500, message="Somthing went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
});


// app.listen(3000, () =>{
//     console.log('Server is running on port 3000');
// });

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


