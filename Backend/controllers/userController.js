const ErrorHandler = require("../utils/errorhandler");
const catchAsysncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js")
const crypto = require("crypto");

//Register for user

 exports.registerUser = catchAsysncErrors(async(req,res,next) => {
     const {name,email,password} = req.body;

     const user = await User.create({
         name,email,password,
         avatar:{
             public_id: "this is for sample id",
             url:"profilepicurl"
         }
     });

     sendToken(user,201,res);
 });

 //Login User
 exports.loginUser = catchAsysncErrors (async (req,res,next)=>{
    const {email, password} = req.body;
//Check the user if they give password and email 
    if(!email|| !password){
        return next(new ErrorHandler("Please Enter Email and Password",400))
    }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalis email or password",401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalis email or password",401));
    }
    sendToken(user,200,res);
 });

 //Logout User
 exports.logout = catchAsysncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
 })

 // Forgot Password
 exports.forgotPassword = catchAsysncErrors(async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next (new ErrorHandler("User not found",404));
    }

    //Get Reset Password Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave:false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then plese ignore it`;

    try {
        
        await sendEmail({
            email: user.email,
            subject: `Sneakers Rental Password Recovery`,
            message,

        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfull`,
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave:false });

        return next (new ErrorHandler(error.message, 500));
    }
 })

 //Reset Password
 exports.resetPassword = catchAsysncErrors(async(req, res, next)=>{

    //Creating token hash 
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    })

    if(!user) {
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",404));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
 })

 //Get User Details
 exports.getUserDetails = catchAsysncErrors(async(req,res,next)=>{
    
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    })
    
 })

 //Update User Password
 exports.updatePassword = catchAsysncErrors(async(req,res,next)=>{
    
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect old password",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword ){
        return next(new ErrorHandler("Password doesnot match",400));
    }

    user.password = req.body.newPassword;

    await user.save()

    sendToken(user,200,res);
    
 })


  //Update User Profile
  exports.updateProfile = catchAsysncErrors(async(req,res,next)=>{
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    //We will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,

    })
    
 })

 //Get users ---admin
 exports.getAllUser = catchAsysncErrors(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    })
 })

 //Get single user ---admin
 exports.getSingleUser = catchAsysncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User is not found with Id: ${req.params.id}`))
    }
    

    res.status(200).json({
        success: true,
        user,
    })
 })

 //Update User Role --- Admin
 exports.updateUserRole = catchAsysncErrors(async(req,res,next)=>{
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,

    })
    
 })

 //Delete User ---Admin
 exports.deleteUser = catchAsysncErrors(async(req,res,next)=>{
    
    const user = await User.findById(req.params.id);

    //We will remove cloudinary later
    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }
    await user.remove();


    res.status(200).json({
        success: true,
        message: "Deleted successfully"

    })
    
 })
