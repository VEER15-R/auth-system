import jwt from "jsonwebtoken"
import { use } from "react" 

// Access Token
export const  generateAccessToken = (userId)=>{

    return jwt.sign(
        {id:userId._id},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn:"15m"}
    );
};

// Refresh Token
export  const  generateRefreshToken = (userId)=>{
    return jwt.sign(
        {id:userId._id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:"7d"}
    );
};

//  verify AccessToken
export const verifyAccessToken = (token)=>{
    try{
        return jwt.verify(token,process.env.JWT_ACCESS_SECRET)
    }catch(erro){
        return null;
    }
};

// verify RefreshToken
export const verifyRefreshToken = (token) => {
  try{
        return jwt.verify(token,process.env.JWT_REFRESH_SECRET)
    }catch(erro){
        return null;
    }
};