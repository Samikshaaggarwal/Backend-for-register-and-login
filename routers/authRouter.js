const express= require('express');
const authRouter=express.Router();
const userModel=require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const JWT_KEY=require('../secrets');

// require('dotenv').config({path:'./.env'});
// const JWT_KEY=process.env.JWT_KEY;

authRouter
.route('/signup')
.get(middleware1,getSignUp,middleware2)
.post(postSignUp)

authRouter
.route('/login')
.post(loginUser)

function middleware1(req,res,next){
    console.log('middleware1 encountered');
    next();
}
function middleware2(req,res,next){
    console.log('middleware2 encountered');
    next();
    console.log("middleware2 ended req/res cycle");
    // res.sendFile('/public/index.html',{root:__dirname});
}



function getSignUp(req,res,next){
    console.log('getSignUp called');
    next();
    res.sendFile('/public/index.html',{root:__dirname});
}

async function postSignUp(req,res){
    let dataObj= req.body;
    console.log(dataObj);
    let user=await userModel.create(dataObj);
    console.log('backend',user);
    res.json({
        message:"user signed up",
        data:user
    });
}

async function loginUser(req,res){
    try{
        let data= req.body;
        if(data.email){
        let user= await userModel.findOne({email:data.email});
        if(user){
            const isMatch = await bcrypt.compare(data.password, user.password);
            if(isMatch){
                let uid=user['_id'];
                let token=jwt.sign({payload:uid},JWT_KEY);
                res.cookie('login',token,{httpOnly:true});
                // res.cookie('isLoggedIn',true);
                return res.json({
                    message:'User has logged in',
                    userDetails:data
                })
            }
            else{
                return res.json({
                    message:'wrong credentials'
                })
            }
        }
        else{
            return res.json({
                message:'User not found'
            })
        }
    }
    else{
        return res.json({
            message:'empty field found'
        })
    }
    }
catch(err){
    res.json({
        message:err.message
    });
}
}
module.exports=authRouter;