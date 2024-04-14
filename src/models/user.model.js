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

  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  Avatar: {
    type: String, //cloudinary url
    required: true,
  },
  coverImage: {
    type: String, //cloudinary url
  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  password: {
    type: String,
    required: [true, "Password is required"],
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

module.exports = mongoose.model("User", userSchema);
