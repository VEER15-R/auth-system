import { NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from "@/lib/token";
import { verifyRefreshToken } from "@/lib/token";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await connectDB();

    //cookies se refreshToken
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // no refreshToken
    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token", success: false },
        { status: 401 },
      );
    }

    // verify refreshToken
    const decodedRefresh = verifyRefreshToken(refreshToken);

    if (!decodedRefresh) {
      return NextResponse.json(
        { message: "refreshToken expired", success: false },
        { status: 401 },
      );
    }

    // DB me user Check
    const user = await User.findById(decodedRefresh.id);

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { message: "Refresh token mismatch", success: false },
        { status: 401 },
      );
    }

    // New accessToken
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // DB save new refreshToken
    user.refreshToken = newRefreshToken;
    await user.save();

    //create response
    const response = NextResponse.json(
      { message: "Token refresh", success: true },
      { status: 200 },
    );

    // set accessToken in cookies
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 min
    });

    //set refreshToken in cookies
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: " Server Error", success: false },
      { status: 500 },
    );
  }
}
