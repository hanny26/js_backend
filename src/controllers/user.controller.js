const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const User = require("../models/user.model.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

// access token and refresh token generation , generate karaye hai
const genrateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    //   user ke andar value add krna
    user.refreshToken = refreshToken;
    //  ek or parameter pass krege validate before save
   await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken }


  } catch (error) {
    throw new ApiError(500, "Failed to generate access and refresh token");
  }
};

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
const loginUser = asyncHandler(async (req, res) => {
  console.log("req.body: ", req.body);
  const { email, username, password } = req.body;

  if (email || username) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //password check
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // generate access token and refresh token
//   lets accesstoken and refreshtoken lets call method 
   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

//  db vala User
  const loggedInUser =  User.findById(user._id).select("-password -refreshToken")

 //cookies bhejne ke liye option use krna padta hai 
 //httponly true and secure true krne se only server se modified hogi , frontend se nahi modify ho sakti 

    const options = {
        httpOnly: true,
        secure : true
    }
//if object na banake sirf loggedIN user ko bhej de aur login successfully bhej de toh bi chale 
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )

});

//Logout User logic
// fist of all remove all cookies, 
//than reset the refresh token , so it would be logged out ,basically removing 

const logoutUser = asyncHandler(async (req, res) => {
   
})

module.exports = { registerUser, loginUser , logoutUser };
