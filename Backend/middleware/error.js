const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    
//MongoDB wrong Id error handler
if(err.name === "CastError"){
    const message = `Resources not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message,400); //Status code 400 means badrequest
}

//Mongoose duplicate key error handler.
if(err.code === 11000 ){
    const message = `Dublicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message,400);
}

//JWT is wrong error
if(err.name === "JsonWebTokenError"){
    const message = `Json Web Token is invalid, try again`;
    err = new ErrorHandler(message,400); //Status code 400 means badrequest
}

//JWT expire error
if(err.name === "TokenExpiredError"){
    const message = `Json Web Token is expired, try again`;
    err = new ErrorHandler(message,400); //Status code 400 means badrequest
}

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}
