const {asyncHandler} = require('../utils/asyncHandler.js');
const {ApiError} = require('../utils/ApiError.js');
const User = require('../models/user.model.js');
const {  uploadOnCloudinary } = require('../utils/cloudinary.js');
const {ApiResponse} = require('../utils/ApiResponse.js');

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
//    console.log("email: ", email);
  
//    getting the user details
    if(
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");    
    }

//checking user already exist or not, findOne() is a method which find the user 
const existedUser= await User.findOne({
    $or: [
        { email },
        { username }
    ]
});
// lets check for existedUser , hai to error , nahi hai toh create, 409 user ka error

if(existedUser){
    throw new ApiError(409, "User or email already exists");
}

//for avatar and cover image
const  avatarLocalPath = req.files?.avatar[0]?.path;
 const coverImageLocalPath = req.files?.coverImage[0]?.path;
//checking avatar aya hai ki nhi 
if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
}

const avatar = await uploadOnCloudinary(avatarLocalPath);

const coverImage = await uploadOnCloudinary(coverImageLocalPath);
if (!avatar) {
    throw new ApiError(400, "avatar file is requires");
}

// now entry in database
 const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
})
// checking user empty or not 
// in select() method we can pass those fields jo apne ko select krna hai 

 const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
 )
//if created user nahi hai 
if (!createdUser) {
    throw new ApiError(500, "User not created");
    }


    res.status(201).json(new ApiResponse(200, createdUser, "User created successfully"));


})




module.exports = {registerUser};