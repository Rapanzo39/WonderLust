if(process.env.NODE_ENV != "production")
{
    require('dotenv').config();
}

const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


//Routes
const listingsRouter = require("./routes/listing.js");   
const reviewsRouter = require("./routes/review"); 
const userRouter = require("./routes/user.js");    
const wishlistRouter = require("./routes/wishlist");
const legalRouter = require("./routes/legal");
const bookingRouter = require("./routes/booking.js");
const paymentRoutes = require("./routes/payment"); // 💳 PAYMENT ROUTES

//database connection
const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log('Database connection successful');
}).catch((err)=>{
    console.error('Database connection error', err);
})
async function main() {
    await mongoose.connect(dbUrl);
}

//view engine 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);



//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());//imp for payment route
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


//session store
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


//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//global variables for flash messages and current user
app.use(async (req, res, next) => {
    if (req.user) {
        await req.user.populate("wishlist");
    }

    res.locals.flashMessages = req.flash("success");
    res.locals.errorMessages = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.use("/wishlist", wishlistRouter);
app.use("/", legalRouter);
app.use("/bookings", bookingRouter);
app.use("/", paymentRoutes); // 💳 PAYMENT ROUTES


// 404 and error handling
app.use((req,res,next)=>{
    next(new ExpressError(404 , "Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500, message="Somthing went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
});

//server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


