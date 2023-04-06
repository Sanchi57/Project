const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt =require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema ({
    name: {
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Name cannont contain more than 30 characters"],
        minLength:[2,"Atleast more the 2 character"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your email address"],
        unique:true,
        validate:[validator.isEmail,"Please enter valid email address"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your password"],
        minLength:[6,"Atleast more the 2 character"],
        select: false,
    },
    avatar: 
    {
        public_id: {
            type:String,
            required: true
        },
        url: {
            type: String,
            requird: true
        }
    },
    role: {
        type: String,
        default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function(next){

 if(!this.isModified("password")){       //It check the fill of password is modified or not
        next();
 }

    this.password = await bcrypt.hash(this.password,10) //hashing the password 
})

// JWT Token
//Generally create the token and save in the cookies , so here is the method.
userSchema.methods.getJWTToken = function () {
    return JWT.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    });
};
//Compare Password
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){
    //Generate Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hasing and resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60*1000;
    
    return  resetToken;
}


module.exports = mongoose.model("User", userSchema);
