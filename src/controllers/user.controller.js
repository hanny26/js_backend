const {asyncHandler} = require('../utils/asyncHandler');

const registerUser = asyncHandler(async (req, res) => {
    response.status(200).json({
        success: true,
        message: 'User registered successfully'
    });
})

module.exports = {registerUser};