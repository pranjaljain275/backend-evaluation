const jwt = require("jsonwebtoken");

const authenticator = (req,res,next)=> {
    const token = req.headers.authorization;
    if(token) {
        const decoded = jwt.verify(token, process.env.key);
        if(decoded) {
            const userId = decoded.userId;
            req.body.userId = userId;
            next();
        }
        else {
            res.send("login first");
        }
    }
    else {
        res.send("login first");
    }
}

module.exports = {
    authenticator
}