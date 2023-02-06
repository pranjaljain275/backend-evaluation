const authorise = (roleArr)=>{
    return (req,res,next)=>{
        const role = req.body.role;
        if(roleArr.includes(role)){
            next();
        }
        else {
            res.send("Not authorised");
        }
    }
}

module.exports = {
    authorise
}