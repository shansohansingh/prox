import { connectDB } from "../../../../lib/mongoose";
import { Chat } from "../../../../models/Chat";
import User from "../../../../models/User";
import { getGeminiResponse } from "../../../../lib/Gemini";
import jwt from "jsonwebtoken";
import { getUserIdFromToken } from "../../../../lib/auth";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

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
    
    // system instruction
    const systemInstruction = `You are a helpful, intelligent AI assistant designed to assist ${user.name} for related fitness query. Your Name is ProX AI - Fitness Buddy. Always respond with clarity, friendliness, and respect. Maintain a helpful tone, and ensure responses are tailored for ${user.name}'s needs. other topics are not allowed. If the query is outside of fitness, politely inform the user that you can only assist with fitness-related questions. if any inappropriate or harmful requests are made, respond with a reminder of your purpose to assist with fitness-related queries only. if any abusive language is used, respond with a polite reminder to maintain respectful communication. if any user ask personal identy, tell you are an AI model and do not have personal identity you can call yourself ProX AI - Fitness Buddy.`;
    console.log(prompt,"sys");

    let chat;

    // 🔹 1. Find or create chat
    if (incomingChatId) {
      chat = await Chat.findOne({ chatId: incomingChatId, user: user._id });

      if (!chat) {
        return new Response(JSON.stringify({ error: "Chat not found" }), {
          status: 404,
        });
      }
    } else {
      const createdAt = Date.now();
      const title = prompt.slice(0, 30).trim();
      const encoded = jwt.sign({ title, createdAt }, JWT_SECRET);
      const chatId = `${user._id}_${encoded}_${createdAt}`;

      chat = new Chat({
        user: user._id,
        chatId,
        title,
        chats: [],
      });
    }

    // 🔹 2. Build history
    const history = chat.chats.flatMap((c) => [
      { role: "user", parts: [{ text: c.user.text }] },
      { role: "model", parts: [{ text: c.assistant.text }] },
    ]);

    history.push({ role: "user", parts: [{ text: prompt }] });

    // 🔹 3. Send to Gemini
    const assistantReply = await getGeminiResponse(history, systemInstruction);

    // 🔹 4. Save new message
    const message = {
      user: { text: prompt, time: new Date(userTime) },
      assistant: { text: assistantReply?.replace("*", "").trim(), time: new Date() },
    };

    chat.chats.push(message);
    await chat.save();

    return new Response(JSON.stringify({ chat, respond: assistantReply?.replace("*", "").trim() }), {
      status: 200,
    });
  } catch (err) {
    const status =
      err.message === "Unauthorized" || err.message === "Invalid token"
        ? 401
        : 500;

    console.error("Chat POST error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status,
    });
  }
}
