const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const userRoute = express.Router();
const { Usermodel } = require("../models/user.model");
const { authenticate } = require("../middlewares/authenticate");
const { authorise } = require("../middlewares/authorise");

// signup
userRoute.post("/signup", async (req,res)=>{
    try {
        let data = req.body;
        let user = new Usermodel(data);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hashSync(user.password, salt);
        await user.save();
        console.log(user);
        res.send("User Registered");
    } catch (err) {
        console.log(err);
        res.send({"message":"Something Went Wrong"});
    }
})

// login
userRoute.post("/login", async (req,res)=>{
    try {
        let {email, password} = req.body;
        let user = await Usermodel.findOne({email});
        if(user != undefined) {
            let result = await bcrypt.compare(password, user.password);
            if(result == true) {
                const normalToken = jwt.sign({userID: user._id, role: user.role}, process.env.key1, {expiresIn: 60});
                const refreshToken = jwt.sign({userID: user._id}, process.env.key2, {expiresIn: 300});
                res.send({normalToken, refreshToken, "message": "LOGIN SUCCESS"});
            }
            else {
                res.send("Wrong Credential");
            }
        }
        else {
            res.send("Wrong Credential");
        }
    } catch (err) {
        console.log(err);
        res.send({"message":"Something Went Wrong"});
    }
})

// get new token
userRoute.get("/getnewtoken", async (req,res)=>{
    try {
        const refreshtoken = req.headers.authorization?.split(" ")[1];
        if(!refreshtoken) {
            res.send("Login First");
        }
        jwt.verify(refreshtoken, process.env.key2, (err, decoded)=>{
            if(err){
                res.send({"msg": "Login First", "err": err.message});
            }else{
                const normalToken = jwt.sign({userID: decoded.userID}, process.env.key1, {expiresIn: 60});
                res.send({normalToken, "msg": "Login Success"});
            }
        })
    } catch (err) {
        console.log(err);
        res.send({"message":"Something Went Wrong"});
    }
})

// logout
userRoute.get("/logout", async (req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token);
        const blacklist = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"));
        blacklist.push(token);
        fs.writeFileSync("./blacklist.json", JSON.stringify(blacklist), "utf-8");
        res.send("Logout Success");
    } catch (err) {
        console.log(err);
        res.send({"message":"Something Went Wrong"});
    }
})

//goldrate, 
userRoute.get("/goldrate", authenticate, async (req,res)=>{
    try {
        res.send("Gold Rate");
    } catch (err) {
        console.log(err);
        res.send({"message":"Something Went Wrong"});
    }
})

// /userstats
userRoute.get("/userstats",authenticate, authorise(["manager"]), async (req,res)=>{
    try {
        res.send("User Stats");
    } catch (err) {
        console.log(err);
        res.send({"message":"Something Went Wrong"});
    }
})

module.exports = {
    userRoute
}