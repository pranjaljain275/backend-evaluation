const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { connection } = require("./config/db");
const { authenticator } = require("./middlewares/authenticator");
const { postRoute } = require("./routes/posts.route");
const { userRoute } = require("./routes/users.route");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", userRoute);
// app.use(authenticator);
app.use("/posts", postRoute);

app.listen(process.env.port, async (req,res)=> {
    try {
        await connection;
        console.log("Connected to DB");
    }
    catch (err) {
        console.log(err);
    }
    console.log(`Running on port ${process.env.port}`)
})