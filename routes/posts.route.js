const express = require("express");
const { authenticator } = require("../middlewares/authenticator");

const postRoute = express.Router();
const { Postmodel } = require("../models/post.model");

// create
postRoute.post("/create", async(req,res)=> {
    try {
        const data = req.body;
        const post = new Postmodel(data);
        await post.save();
        res.send("Post Added");
    }
    catch(err) {
        console.log(err);
        res.send({"err": "Something went wrong"});
    }
});

// get
postRoute.get("/", async(req,res)=> {
    try {
        let device = req.query;
        if(device != undefined) {
            let data = await Postmodel.find(device);
            res.send(data);
        } else {
            let data = await Postmodel.find();
            res.send(data);
        }
    }
    catch(err) {
        console.log(err);
        res.send({"err": "Something went wrong"});
    }
});

// update
postRoute.patch("/update/:id", authenticator ,async(req,res)=> {
    try {
        let ID = req.params.id;
        let updateTo = req.body;
        let post = await Postmodel.findOne({"_id": ID});
        const postUserId = post.userId;
        const userIdReq = req.body.userId;
        if(postUserId === userIdReq) {
            await Postmodel.findByIdAndUpdate({"_id": ID}, updateTo);
            res.send("Updated");
        }
        else {
            res.send("Not authorized");
        }
    }
    catch(err) {
        console.log(err);
        res.send({"err": "Something went wrong"});
    }
});

// delete
postRoute.delete("/delete/:id", authenticator , async(req,res)=> {
    try {
        let ID = req.params.id;
        let post = await Postmodel.findOne({"_id": ID});
        const postUserId = post.userId;
        const userIdReq = req.body.userId;
        if(postUserId === userIdReq) {
            await Postmodel.findByIdAndDelete({"_id": ID});
            res.send("Deleted");
        }
        else {
            res.send("Not authorized");
        }
    }
    catch(err) {
        console.log(err);
        res.send({"err": "Something went wrong"});
    }
});

module.exports = {
  postRoute,
};
