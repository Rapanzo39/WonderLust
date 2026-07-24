const User = require("../models/user.js");



module.exports.renderSignupForm = (req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Successfully signed up!");
        res.redirect(res.locals.redirectUrl || "/listings");

    });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
};

module.exports.Login = async(req,res)=>{
            req.flash("success", "Welcome back to Wanderlust!");
            res.redirect("/listings");
        };

module.exports.logout = (req,res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });

};