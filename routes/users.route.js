const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userRoute = express.Router();

const { Usermodel } = require("../models/user.model");

// register
userRoute.post("/register", async(req,res)=> {
    try {
        let data = req.body;
        const user = new Usermodel(data);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        res.send("User Registered");
        console.log(data);
    }
    catch(err) {
        console.log(err);
        res.send({"err": "Something went wrong"});
    }
})

// login
userRoute.post("/login", async(req,res)=> {
    try {
        let {email, password} = req.body;
        let user = await Usermodel.find({email});
        if(user.length > 0) {
            let result = await bcrypt.compare(password, user[0].password);
            if(result) {
                const token = jwt.sign({userId: user[0]._id} ,process.env.key);
                res.send({token});
            }
            else {
                res.send('wrong credential');
            }
        }
        else  {
            res.send('wrong credential');
        }
    }
    catch(err) {
        console.log(err);
        res.send({"err": "Something went wrong"});
    }
})

module.exports = {
    userRoute
}