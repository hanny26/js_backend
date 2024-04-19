const {asyncHandler} = require('../utils/asyncHandler.js');

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
})

module.exports = {registerUser};