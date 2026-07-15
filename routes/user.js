const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req,res)=>{
    res.render("user/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username, email, password} = req.body;
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Successfully signed up!");
    res.redirect("/listings");

    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login", (req,res)=>{
    res.render("user/login.ejs");
});

router.post("/login", 
    passport.authenticate("local", {
        failureFlash:true, 
        failureRedirect:"/login"
    }), 
        async(req,res)=>{
            req.flash("success", "Welcome back to Wanderlust!");
            res.redirect("/listings");
        }   
);

module.exports = router;