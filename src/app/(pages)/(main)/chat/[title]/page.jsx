"use client";
import { Smile, Send, MessageCircleMore, Bot, User } from "lucide-react";
import API from "../../../../../contexts/API";
import { useCallback, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getGreeting, ShowTime } from "@/contexts/CallBack";

const ChatArea = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasLoadedChat, setHasLoadedChat] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { title: routeChatId } = useParams();

  const getChat = useCallback(async () => {
    try {
      const response = await API.get(`/chat/${routeChatId}`);
      setMessages(
        response.data.chat.chats.flatMap((pair) => [
          {
            type: "user",
            content: pair.user.text,
            timestamp: ShowTime(pair.user.time),
          },
          {
            type: "bot",
            content: pair.assistant.text,
            timestamp: ShowTime(pair.assistant.time),
          },
        ])
      );
    } catch (error) {
      console.error("Error fetching chat:", error);
      if (error.response?.status === 404) {
        router.replace("/chat/new");
      }
    }
  }, [routeChatId, router]);

  useEffect(() => {
    if (!hasLoadedChat && pathname !== "/chat/new") {
      getChat().then(() => setHasLoadedChat(true));
    }
  }, [getChat, pathname, hasLoadedChat]);

  const createMessage = ({ type, content, isTemporary = false }) => ({
    type,
    content,
    timestamp: new Date().toLocaleTimeString(),
    ...(isTemporary && { isTemporary: true }),
  });

  const getAiAnswer = useCallback(
    async (currentPrompt) => {
      if (!currentPrompt.trim()) return;

      const userTime = Date.now();

      const newUserMessage = {
        type: "user",
        content: currentPrompt,
        timestamp: new Date(userTime).toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setPrompt("");

      const thinkingMessage = createMessage({
        type: "bot",
        content: "Thinking...",
        isTemporary: true,
      });

      setMessages((prev) => [...prev, thinkingMessage]);

      try {
        const payload = {
          prompt: currentPrompt,
          userTime,
        };
        if (routeChatId !== "new") payload.chatId = routeChatId;

        const response = await API.post(`/chat`, payload);
        const newChatId = response.data.chat.chatId;

        if (pathname === "/chat/new") {
          router.replace(`/chat/${newChatId}`, undefined, { shallow: true });
        }

        const aiMessage = {
          type: "bot",
          content: response.data.respond,
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((m) => m.isTemporary);
          if (index !== -1) {
            updated.splice(index, 1, aiMessage);
          } else {
            updated.push(aiMessage);
          }
          return updated;
        });
      } catch (error) {
        const errorMessage = createMessage({
          type: "error",
          content: "Something went wrong. Please try again.",
        });

        console.log(error);
        setMessages((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((m) => m.isTemporary);
          if (index !== -1) updated[index] = errorMessage;
          return updated;
        });
      }
    },
    [routeChatId, pathname, router]
  );
  const renderWelcomeScreen = () => {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg)]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[var(--text-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircleMore className="text-[var(--text-primary)] fill-[var(--bg)] w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            {getGreeting()}! 👋
          </h2>
          <p className="text-[var(--text-muted)] text-lg mb-8">
            How can I help you today? Ask me anything or start a conversation.
          </p>
          <div className="space-y-3 text-sm text-[var(--text-muted)]">
            <>
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-[var(--text-primary)] rounded-full"></span>
                Ask questions about any topic
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-[var(--text-primary)] rounded-full"></span>
                Get help with tasks and projects
              </p>
            </>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg)]">
      {messages.length === 0 ? (
        renderWelcomeScreen()
      ) : (
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              } mb-6`}
            >
              <div
                className={`flex items-start gap-4 max-w-2xl ${
                  message.type === "user" ? "flex-row-reverse text-right" : ""
                }`}
              >
                <div className="w-10 h-10 bg-[var(--text-primary)] text-[var(--bg)] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                  {message.type === "user" ? (
                    <User size={18} />
                  ) : (
                    <Bot size={18} />
                  )}
                </div>

                <div
                  className={`flex flex-col ${
                    message.type === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 mb-2 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {message.type === "user" ? "You" : "Assistant"}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {message.timestamp}
                    </span>
                  </div>

                  <div
                    className={`bg-[var(--surface)] rounded-2xl px-4 py-3 shadow-md ${
                      message.type === "user"
                        ? "rounded-tr-md"
                        : "rounded-tl-md"
                    }`}
                  >
                    <p className="text-[var(--text-primary)] leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
            placeholder="Type your message..."
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none text-sm lg:text-base"
            onKeyDown={(e) => {
              if (e.key === "Enter") getAiAnswer(prompt);
            }}
          />

          <div className="flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => getAiAnswer(prompt)}
              className="bg-[var(--text-primary)] text-[var(--bg)] p-2.5 rounded-xl hover:bg-[var(--text-muted)] transition-all duration-200 flex-shrink-0 shadow-md"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
