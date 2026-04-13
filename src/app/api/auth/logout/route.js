import {NextResponse} from "next/server";
import User from "@/models/User"
import {connectDB} from "@/lib/db"
import {verifyRefreshToken} from '@/lib/token';
import { decode } from "node:punycode";


export async function POST(request) {
    try{
        await connectDB();

        const refreshToken= request.cookies.get("refreshToken")?.value;
        if(refreshToken){

            const decoded =verifyRefreshToken(refreshToken)
            if(decoded){
                const user = await User.findById(decode.id);

                if(user){
                    user.refreshToken=null;
                    await User.save();
                }
            }

            // cookies delete
            const response =NextResponse.json({
                message:"Logged out successfully",
                success:true,
            })

            response.cookies.set("accessToken","",{
                httpOnly:true,
                expires:new Date(0),
                path:"/",
            });

            response.cookies.set("refreshToken","",{
                httpOnly:true,
                expires:new Date(0),
                path:"/",
            });

            return response;
        }
    }catch(error){
        console.log("Logout Error",error)
        return NextResponse.json(
            {message:"Logout failed",success:false},
            {status:500}
        );
    }
}
 