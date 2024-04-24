// ye verify krega user hai ya nahi hai 
const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/user.model");

//lets write a method to verify the user

const verifyJwt = asyncHandler(async (req, res, next) => {
    //request ke pass cookie ka access hai , app.js me use kiya hai cookie parser, hume bearer or spcae nhi chahiye 
    //  hume sirf token ki value chahiye for that ye js use krege
   const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
  throw new ApiError(401, "Access denied. No token provided");
     }

    //lets verify the token jwt 
   const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)  

   const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

   if(!user){
    
       throw new ApiError(401, "invalid access token")
   }

   //req ka access hai humare pass toh usme ek object add kr dete hai 
    req.user = user;
    next();
    
});