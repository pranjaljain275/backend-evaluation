const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name:String,
        email:String,
        role:{
            type:String,
            enum:["user", "manager"],
            default:"user"
        },
        password:String
    }
)

const Usermodel = mongoose.model("user",userSchema);

module.exports = {
    Usermodel
}