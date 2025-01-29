import { connectMongoDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");

    console.log("user: ", user);

    if (user) {
      // User exists
      return NextResponse.json({ user: true }, { status: 200 });
    } else {
      // User does not exist
      return NextResponse.json({ user: false }, { status: 200 });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}