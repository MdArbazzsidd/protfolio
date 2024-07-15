
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({

    fullname:{
        type:String,
        required:[true,"must be enter fulname"]
    },

    email:{
        type:String,
        required:[true,"must be enter email"]
    },

    phone:{
        type:Number,
        required:[true,"must be enter phone number"]
    },

    aboutme:{
        type:String,
        required:[true,"must be enter about section"]
    },

    password:{
        type:String,
        minLength:[8, "must be enter above 8 letter"],
        required:[true, "must be enter password"],
        select:false,
    },

    avtar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },

    resume:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },

    portfolioURL:{
        type:String,
        required:[true, "must be enter url of portfolio"]
    },
    githuburl:String,
    instagramurl:String,
    linkedInurl : String,

    resetPasswordToken:String,
    restPasswordExpire: Date,

},{timestamps:true})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function(enterdPassword){
    return await bcrypt.compare(enterdPassword,this.password);
}

userSchema.methods.genrateJsonWebToken = async function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn:process.env.JWT_EXPIRES
    })
}

export const User = mongoose.model("User", userSchema);