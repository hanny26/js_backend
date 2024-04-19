const {asyncHandler} = require('../utils/asyncHandler.js');

const registerUser = asyncHandler(async (req, res) => {
   res.status(200).json({
        success: true,
        message: 'User registered successfully'
    });
})

module.exports = {registerUser};