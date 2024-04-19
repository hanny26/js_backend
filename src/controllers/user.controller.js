const {asyncHandler} = require('../utils/asyncHandler.js');
const {ApiError} = require('../utils/ApiError.js');
const User = require('../models/user.model.js');

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend 
    // Validation - not empty and email format
    // check if user already exists: username , email 
    // check for cover images , check for Avatar 
    //  upload them to cloudinary
    // create user object - creat entry in db 
    // remove password and refresh token field from password
    //check for user creation 
    // return res

   //if form se ya json se data aa rha hai toh req.body me ayega , but url se a rha hai toh age dekhege 
   const {fullname, email , username , password} = req.body;
   console.log("email: ", email);
  
//    getting the user details
    if(
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");    
    }

//checking user already exist or not





})




module.exports = {registerUser};