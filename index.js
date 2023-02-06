const express = require("express");
require("dotenv").config();

const { connection } = require("./config/db");
const { userRoute } = require("./routes/user.route");

const app = express();

app.get("/", (req,res)=>{
    res.send("WELCOME");
})

app.use(express.json());
app.use("/", userRoute);

app.listen(process.env.port, async (req,res)=>{
    try {
        await connection;
        console.log("Connected to DB");
    } catch (err) {
        console.log(err);
        console.log("Error while connecting to DB");
    }
    console.log(`Running at server on port ${process.env.port}`); 
})