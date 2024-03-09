const jwt=require('jsonwebtoken');
require('dotenv').config();

const fetchUser= (req,res,next)=>{
    try {
        let token=req.header('Authorization');
        if(!token){
            return res.status(400).send('unauthorized access');
        }
        token = token.replace(/^Bearer\s+/, "");
        const data=jwt.verify(token,process.env.SECRET);
        req.uid=data.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('server error')
    }
}

module.exports=fetchUser;