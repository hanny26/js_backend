const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const User = require("../models/user.model.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { ApiResponse } = require("../utils/ApiResponse.js");


// access token and refresh token generation , generate karaye hai
const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  console.log("req.body: ", req.body);
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
  const { fullName, email, username, password } = req.body;
  //    console.log("email: ", email);

  //    getting the user details
  // if(
  //     [fullName, email, username, password].some((field) => field?.trim() === "")
  // ){
  //     throw new ApiError(400, "All fields are required");
  // }

  //checking user already exist or not, findOne() is a method which find the user
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  // lets check for existedUser , hai to error , nahi hai toh create, 409 user ka error

  if (existedUser) {
    throw new ApiError(409, "User or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log("avatarLocalPath: ", avatarLocalPath);

  //  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  // console.log("coverImageLocalPath: ", coverImageLocalPath);
  //checking avatar aya hai ki nhi
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("avatar: ", avatar);

  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is requires");
  }

  // if (!avatarUpload || !coverImageUpload) {
  //     throw new ApiError(400, "Failed to upload avatar or cover image");
  // }

  // now entry in database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    // coverImage: coverImage.url,
    email,
    password,
    username: username.toLowerCase(),
  });
  // checking user empty or not
  // in select() method we can pass those fields jo apne ko select krna hai

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //if created user nahi hai
  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

//LOGIN USER logic
//algo for userlogin
// body se email or username or password lelo
// find user
//password check
//access and refreshh token
//send cookies
const loginUser = asyncHandler(async (req, res) =>{
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const {email, username, password} = req.body
  console.log(email);

  if (!username && !email) {
      throw new ApiError(400, "username or email is required")
  }
  
  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")
      
  // }

  const user = await User.findOne({
      $or: [{username}, {email}]
  })

  if (!user) {
      throw new ApiError(404, "User does not exist")
  }
  // console.log("user: ", user);

//  const isPasswordValid = await User.isPasswordCorrect(password)
//  console.log("isPasswordValid: ", isPasswordValid);
   
//  if (!isPasswordValid) {
//   throw new ApiError(401, "Invalid user credentials")
//   }


 const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
      // httpOnly: true,
      // secure: true aa vastu pchi on kri deje haal error ape etle
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200, 
          {
              user: loggedInUser, accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )

})


//Logout User logic
// fist of all remove all cookies, 
//than reset the refresh token , so it would be logged out ,basically removing 

const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
      req.user._id,
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      // httpOnly: true,
      // secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
})

module.exports = { registerUser, loginUser , logoutUser };
