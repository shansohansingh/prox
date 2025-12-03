"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Sparkles, Smile } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import API from "@/contexts/API";
import {
  renderAssistantMessage,
  renderGeneratingMessage,
  renderUserMessage,
  renderWelcomeScreen,
} from "./_components/Renders";
import { ShowTime } from "@/contexts/CallBack";

const ImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const { title: routeChatId } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversations, isGenerating]);

  const fetchImageChat = useCallback(async () => {
    if (routeChatId === "new") return;

    try {
      const response = await API.get(`/image-generations/${routeChatId}`);
      const pastChats = response.data.chat.chats || [];

      const formattedMessages = pastChats.flatMap((pair) => [
        {
          type: "user",
          prompt: pair.user.text,
          timestamp: ShowTime(pair.user.time),
        },
        {
          type: "assistant",
          image: pair.assistant.image,
          timestamp: ShowTime(pair.assistant.time),
        },
      ]);

      setConversations(formattedMessages);
      setChatId(response.data.chat.chatId);
      setHasLoaded(true);
    } catch (error) {
      console.error("Error loading image chat:", error);
      if (error.response?.status === 404) {
        router.replace("/image/new");
      }
    }
  }, [routeChatId, router]);

  useEffect(() => {
    if (!hasLoaded && pathname !== "/image/new") {
      fetchImageChat();
    }
  }, [fetchImageChat, pathname, hasLoaded]);

  const handleGenerateImage = async () => {
    if (!input.trim()) return;

    const userTime = Date.now();
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Push user message
    setConversations((prev) => [
      ...prev,
      {
        type: "user",
        prompt: input,
        timestamp,
      },
    ]);
    setIsGenerating(true);

    try {
      const payload = {
        prompt: input,
        chatId,
        userTime,
      };

      const res = await API.post("/image-generations", payload);
      const newChatId = res.data.chat.chatId;

      if (pathname === "/image/new") {
        router.replace(`/image/${newChatId}`, undefined, { shallow: true });
      }

      setConversations((prev) => [
        ...prev,
        {
          type: "assistant",
          image: res.data.image,
          timestamp,
        },
      ]);

      setChatId(newChatId);
      setInput("");
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)]">
      {conversations.length === 0 ? (
        renderWelcomeScreen()
      ) : (
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 lg:p-8 mb-5"
        >
          {conversations.map((message, index) => (
            <div key={index}>
              {message.type === "user"
                ? renderUserMessage(message)
                : renderAssistantMessage(message)}
            </div>
          ))}

          {isGenerating && renderGeneratingMessage()}
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 p-6 lg:p-8">
        <div className="flex items-center gap-3 lg:gap-4 bg-[var(--surface)] rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-xl">
          <button className="text-[var(--text-muted)] transition-colors flex-shrink-0">
            <Smile size={20} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerateImage()}
            placeholder="Describe the image you want to generate..."
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none text-sm lg:text-base"
          />

          <div className="flex items-center gap-1 lg:gap-2">
            <button
              disabled={isGenerating}
              onClick={handleGenerateImage}
              className="bg-[var(--text-primary)] text-[var(--bg)] p-2.5 rounded-xl hover:bg-[var(--text-muted)] transition-all duration-200 flex-shrink-0 shadow-md"
            >
              {isGenerating ? (
                <div className="animate-spin">
                  <Sparkles size={18} />
                </div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGeneration;
