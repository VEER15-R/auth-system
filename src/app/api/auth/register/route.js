import { connectDB } from "@/lib/db"
import User from "@/models/User";
import bcrypt from "bcryptjs";
import {NextResponse} from 'next/server'
import  {generateAccessToken}    from "@/lib/token";
import {generateRefreshToken} from '@/lib/token'

export async function POST(req){
    try{
    await connectDB();

    const body = await req.json();    

        const {name,email,password} = body;

        // check all fill
        if(!name || !email || !password){
            return NextResponse.json(
                {message:"Fill All The Fields",success:false},
                { status: 400 }
            )
        }

        // check exisit user
        const existingUser = await User.findOne({
            $or:[{email},{name}]
        })

        if(existingUser){
            return NextResponse.json({
                message:"User Allready Exisit",
                success:false
            },{ status: 409 }
            );
        }

        // HashPassword    
        const hashedPassword =await bcrypt.hash(password,10)

        // create User
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        })

        // generate Token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // save refreshToken in DB
        user.refreshToken = refreshToken;
         await user.save();


        // Cookies Set
        const response = NextResponse.json({
            message:"User Register Successful",
            success:true
        },{ status: 201 })

        response.cookies.set("accessToken",accessToken,
            {
                httpOnly:true,
                secure:process.env.NODE_ENV === "production",
                sameSite:"strict",
                maxAge:60*15, // 15 min                 
            })    

        response.cookies.set("refreshToken",refreshToken,
            {
                httpOnly:true,
                secure:process.env.NODE_ENV === "production",
                sameSite:"strict",
                maxAge:60*60*24*7 // 7 days
            });

        return response;

    }catch(error){
        return NextResponse.json({
            message:"Erro",
            success:false,
            error:error.message,
        },{ status: 500 })
    }
}