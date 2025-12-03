import { connectDB } from "../../../../lib/mongoose";
import { ImageGenerations } from "../../../../models/ImageGenerations";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";
import { getUserIdFromToken } from "../../../../lib/auth";
import { downloadImageFromUrl } from "../../../../lib/image-downloader";
import { ImageGenerator } from "@/lib/ImageGenerator";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();
    const user = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const { prompt, chatId: incomingChatId, userTime } = await req.json();

    if (!prompt || prompt.trim() === "") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
      });
    }

    if (!userTime) {
      return new Response(JSON.stringify({ error: "User time is required" }), {
        status: 400,
      });
    }

    const generatedImageUrl = await ImageGenerator(prompt);

    const savedImagePath = await downloadImageFromUrl(
      generatedImageUrl,
      "public/generated-images"
    );

    const message = {
      user: {
        text: prompt,
        time: new Date(userTime),
      },
      assistant: {
        image: savedImagePath,
        time: new Date(),
      },
    };

    let chat;

    if (incomingChatId) {
      chat = await ImageGenerations.findOne({
        chatId: incomingChatId,
        user: user._id,
      });

      if (!chat) {
        return new Response(JSON.stringify({ error: "Chat not found" }), {
          status: 404,
        });
      }

      chat.chats.push(message);
      await chat.save();
    } else {
      const createdAt = Date.now();
      const title = prompt.slice(0, 30).trim();
      const encoded = jwt.sign({ title, createdAt }, JWT_SECRET);
      const chatId = `${user._id}_${encoded}_${createdAt}`;

      chat = new ImageGenerations({
        user: user._id,
        chatId,
        title,
        chats: [message],
      });

      await chat.save();
    }

    return new Response(
      JSON.stringify({
        chat,
        image: savedImagePath,
      }),
      { status: 200 }
    );
  } catch (err) {
    const status =
      err.message === "Unauthorized" || err.message === "Invalid token"
        ? 401
        : 500;

    console.error("Image Chat POST error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status,
    });
  }
}
