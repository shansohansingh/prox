import { connectDB } from "../../../../../lib/mongoose";
import { Voice } from "../../../../../models/Voice";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { chatId } = await params;

    const chat = await Voice.findOne({ chatId });

    if (!chat) {
      return new Response(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ chat }), {
      status: 200,
    });
  } catch (err) {
    console.error("Chat fetch error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
