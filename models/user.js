const mongoose = require("mongoose");
const express = require("express");
const passportLocalMongoose = require("passport-local-mongoose").default;
const Schema = mongoose.Schema;
const User = require("./user.js");


const userSchema = new Schema({
    username:{
        type:String,
        required:true,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);