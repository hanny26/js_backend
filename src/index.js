const dotenv = require('dotenv');
dotenv.config()
const {app} = require('./app.js');
const mongoose = require('mongoose');
const { DB_NAME } = require("./constants.js");
const connectDB = require('./db/index.js');


connectDB().then(() => {
    app.listen(process.env.PORT|| 8000, () => {
        console.log(`Server is running on port : ${process.env.PORT}`);
    })
}).catch((error) => {
    console.log("Error connecting to DB: ", error);
})