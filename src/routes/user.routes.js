// user.routes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const {  verifyJwt } = require("../middlewares/auth.middleware.js")

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  // upload.fields([
  //   {
  //     name: "coverImage",
  //     maxCount: 1,
  //   },
  // ]),
  registerUser
);

router.route("/login").post(loginUser);


// secure routes
router.route("/logout").post( verifyJwt , logoutUser)


module.exports = router;

//fields ek hi field me diff array , and  array me multiple files upload krne ke liye, single file upload krne ke liye single array me daal denge
