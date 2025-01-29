import { connectMongoDB } from "@/lib/db";
import User from "@/models/User";

// Temporary store for session (Not for production)
let lastUserId = null;

// Handle POST request (from login page)
export async function POST(req) {
  try {
    await connectMongoDB();
    const { email } = await req.json();

    // Find user by email
    const user = await User.findOne({ email }).select("_id");

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Store user ID in memory (Replace with proper session storage in production)
    lastUserId = user._id;

    return new Response(JSON.stringify({ message: "User found", id: user._id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing login:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Handle GET request (fetch username based on last stored ID)
export async function GET(req) {
  try {
    await connectMongoDB();

    if (!lastUserId) {
      return new Response(JSON.stringify({ message: "No user ID stored" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch user name based on stored ID
    const user = await User.findById(lastUserId).select("name");
    const name = user?.name || "Unknown User";

    return new Response(JSON.stringify({ name }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
