import { connectDB } from "../../../../lib/mongoose";
import User from "../../../../models/User";
import { getUserIdFromToken } from "../../../../lib/auth";

export async function GET() {
  try {
    const userId = await getUserIdFromToken();

    await connectDB();
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (err) {
    const status =
      err.message === "Unauthorized" || err.message === "Invalid token"
        ? 401
        : 500;

    console.error("GET /profile error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status,
    });
  }
}
