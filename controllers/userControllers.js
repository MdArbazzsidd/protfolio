import { catchAsynError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/usermodel.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtTokenUtils.js";

export const register = catchAsynError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avtar, resume are required !", 400));
  }
  
  const { avtar, resume } = req.files;

  const cloudinaryResForAvtar = await cloudinary.uploader.upload(
    avtar.tempFilePath,
    { folder: "Avtars" }
  );

  if (!cloudinaryResForAvtar || cloudinaryResForAvtar.error) {
    console.error(
      "cloudinary Error:",
      cloudinaryResForAvtar.error || "unkonw cloudinary error"
    );
  }

  const cloudinaryResForResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: "Resume" }
  );

  if (!cloudinaryResForResume || cloudinaryResForResume.error) {
    console.error(
      "cloudinary Error:",
      cloudinaryResForResume.error || "unkonw cloudinary error"
    );
  }

  const {
    fullname,
    email,
    phone,
    aboutme,
    password,
    portfolioURL,
    githuburl,
    instagramurl,
    linkedInurl,
  } = req.body;

  const user = await User.create({
    fullname,
    email,
    phone,
    aboutme,
    password,
    portfolioURL,
    githuburl,
    instagramurl,
    linkedInurl,
    avtar:{
        public_id: cloudinaryResForAvtar.public_id,
        url: cloudinaryResForAvtar.secure_url,
    },
    resume:{
        public_id: cloudinaryResForResume.public_id,
        url: cloudinaryResForResume.secure_url
    },

  });
  
  generateToken(user, "registered succsefully!", 201, res);

});


export const login = catchAsynError(async(req,res, next)=>{
  const {email, password} = req.body

  if(!email || !password){
    return next (new ErrorHandler("Email and password are required!!"));
  }

  const user = await User.findOne({email}).select("+password")
  
  if(!user){
    return next(new ErrorHandler("Opps user not found!! register "));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if(!isPasswordMatch){
    return next(new ErrorHandler("Opps please check email and password again"))
  }

  generateToken(user, "Logged In", 200, res);

})