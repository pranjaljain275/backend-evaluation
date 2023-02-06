const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(token){
        jwt.verify(token, process.env.key1, (err, decoded)=>{
            if(err){
                res.send({"msg": "Login First"});
            }else{
                const role = decoded.role;
                req.body.role = role;
                next();
            }
        })
    }
}

module.exports = {
    authenticate
}