import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/token";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(request) {
  try {
    await connectDB();

    //access token
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: "No access token", success: false },
        { status: 401 },
      );
    }
    // verify accessToken
    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid access Token", success: false },
        { status: 401 },
      );
    }

    //User Fetch
    const user = await User.findById(decoded.id).select(
      "-password -refreshToken",
    );
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "User fetched", success: true, user },
      { status: 200 },
    );
  } catch (error) {
    console.log("ME ERROR", error);
    return NextResponse.json(
      { message: "Server Error", success: false },
      { status: 500 },
    );
  }
}
