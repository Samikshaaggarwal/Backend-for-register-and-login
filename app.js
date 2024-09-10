const { all } = require('axios');
const express= require('express');
const cookieParser= require('cookie-parser');
const app=express();
const PORT=8000;

app.use(express.json());
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
app.use(cookieParser());
// let users=[
//     {
//         'id':1,
//         'name':"Samiksha"
//     },
//     {
//         'id':2,
//         'name':"Sam"
//     }
// ];

//mini app
const userRouter=require('./routers/userRouter');
const authRouter=require('./routers/authRouter');
app.use("/user",userRouter);
app.use("/auth",authRouter);
