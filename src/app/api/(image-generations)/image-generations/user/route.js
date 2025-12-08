import { getUserIdFromToken } from "@/lib/auth";
import { connectDB } from "../../../../../lib/mongoose";
import { ImageGenerations } from "@/models/ImageGenerations";

export async function GET() {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    const chats = await ImageGenerations.find({ user: userId }).sort({
      updatedAt: -1,
    });

    return new Response(JSON.stringify({ chats }), {
      status: 200,
    });
  } catch (err) {
    const status =
      err.message === "Unauthorized" || err.message === "Invalid token"
        ? 401
        : 500;

    return new Response(JSON.stringify({ error: err.message }), {
      status,
    });
  }
}
