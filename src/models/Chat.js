import mongoose from "mongoose";

const pairedMessageSchema = new mongoose.Schema(
  {
    user: {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
    assistant: {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },
    chats: {
      type: [pairedMessageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
