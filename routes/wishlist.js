const express = require("express");
const router = express.Router();
const User = require("../models/user");

// ❤️ ADD TO WISHLIST
router.post("/add/:id", async (req, res) => {
    let user = await User.findById(req.user._id);

    if (!user.wishlist.includes(req.params.id)) {
        user.wishlist.push(req.params.id);
    }

    await user.save();

    res.redirect(req.get("Referrer") || "/listings");
});

// ❌ REMOVE FROM WISHLIST
router.post("/remove/:id", async (req, res) => {

    await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.id }
    });

    res.redirect(req.get("Referrer") || "/wishlist");
});

// 📄 SHOW WISHLIST PAGE
router.get("/", async (req, res) => {
    let user = await User.findById(req.user._id).populate("wishlist");

    res.render("listing/wishlist.ejs", {
        listings: user.wishlist
    });
});

module.exports = router;