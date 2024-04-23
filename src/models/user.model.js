const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  fullName: {
    type: String,
    required: true,
    // trim: true,
    // index: true,
  },
  avatar: {
    type: String, //cloudinary url
    required: true,
  },
  // coverImage: {
  //   type: String, //cloudinary url
  //   required: true,
  // },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
},
{
  timestamps: true,
}

);

//jab data save hone ja rha hoga just usse pehle , jaise conttoller likha hai toh data save kra rha hoga usse pehle jo run hota hai ye vo pre hook hai , me nhi chahta data aise save hojaye , usse pehle kr de hum , kya krle password encrypt krde,,, 
//middleware hai toh next() call krna padega
userSchema.pre("save", async function(next) {
    if(!this.isModified("passwrord")) return next();
    // ab next ko call krdo
    this.password = bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password);
}

//async ki zaroorat nhi hai kyuki vo thoda fast hojata hai 
userSchema.methods.generateAccessToken = function(){
    //sign method jo hai vo generate kr deta hai token ko 
    //id kaha se mileg to ye jo method hai uske pass db ka access hai "this" ke andar  isiliye to function likhte hai or arrow function nhi likhte
   return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET ,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        
        }
)
}   

//refresh token joke bar bar refresh hota hai , isiliye usme hum sirf id rakhte hai 
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
        
        }
)
}

module.exports = mongoose.model("User", userSchema);
