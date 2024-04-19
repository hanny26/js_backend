const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
     }
}

module.exports = {asyncHandler} ;


// ye kar kuch nhi raha ye wrapper func bana rha hai jo sab jagah use hota hai , kahipe promisses vala bi hota hai toh usse promisses me kaise convert kre to vo kaise convet kre to upar dekhege   
// const asyncHandler = (fn) =>  async (req,res, next) => {
//      try {
//          await fn(req,res,next);
//      } catch (error) {
//         res.status(err.code || 500).json({
//             success : false,
//             message : err.message || 'An unknown error occurred'
//         });
//      }
// }