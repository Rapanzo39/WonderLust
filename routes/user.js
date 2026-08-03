const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedRedirectUrl, isLoggedIn} = require("../middleware.js");

const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post( passport.authenticate("local", {
        failureFlash:true, 
        failureRedirect:"/login"
    }), 
        userController.Login 
);

//profile route
router.get("/profile", isLoggedIn, (req, res) => {
    res.render("user/profile.ejs", { currentUser: req.user });
});

    
router.get("/logout", userController.logout);

module.exports = router;