import {NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import {generateAccessToken} from "@/lib/token"
import {generateRefreshToken} from "@/lib/token"
import { json } from "node:stream/consumers";

export  async function POST(req){
    try{
        await connectDB();

        const {email,password} = await req.json();
        // check user

        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({
                message:"User Not Found",
                success:false,
            },{status: 404})
        }

        // check password 
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return NextResponse.json({
                message:"Invalid credentials",
                success:false
            },{status:401})
        }

        // generate  AccessToken
        const accessToken = generateAccessToken(user);

        // generate RefreshToken
        const refreshToken =generateRefreshToken(user);

        // save RefreshToken in DB
        user.refreshToken = refreshToken;
        await user.save()

        // create response
        const response =NextResponse.json({
            meaasge:"Login Successful",
            success:true,
        },{status:200})

        response.cookies.set("accessToken",accessToken,
            {
                httpOnly:true,
                secure:process.env.NODE_ENV === "production",
                sameSite:"strict",
                maxAge:60*15, // 15 min
            }
        )
        response.cookies.set("refreshToken",refreshToken,
            {
                httpOnly:true,
                secure:process.env.NODE_ENV === "production",
                sameSite:"strict",
                maxAge:60*60*24*7, // 7 days
            }
        )
        return response;

    }catch(error){
      return NextResponse.json({
        message:"Error",
        success:false,
        error:error.meaasge,
      })  
    }
}