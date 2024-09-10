// let flag=false; //user logged in or not
const jwt=require('jsonwebtoken');
// require('dotenv').config({path:'./.env'});
// const JWT_KEY=process.env.JWT_KEY;
const JWT_KEY=require('../secrets');

function protectRoute(req,res,next){
    if(req.cookies.login){
        let isVerified=jwt.verify(req.cookies.login,JWT_KEY);
        if(isVerified){
            next();
        }
        else{
            return res.json({
                message:'user not verified'
            })
        }
        }
    else{
        return res.json({
        message:'Operation not allowed'
        })
        }
}

module.exports=protectRoute;