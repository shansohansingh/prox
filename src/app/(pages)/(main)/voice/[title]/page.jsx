"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Mic,
  MicOff,
  MessageCircleMore,
  Bot,
  User,
  Square,
  Volume2,
} from "lucide-react";
import API from "../../../../../contexts/API";
import { useSpeechToText } from "../../../../../hooks/useSpeechToText";
import { useTextToSpeech } from "../../../../../hooks/useTextToSpeech";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getGreeting, ShowTime } from "@/contexts/CallBack";

const VoiceChatArea = () => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasLoadedChat, setHasLoadedChat] = useState(false);

  const { isSpeaking, speakText, stopSpeaking } = useTextToSpeech();
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
  } = useSpeechToText(handleVoiceInput);

  const router = useRouter();
  const pathname = usePathname();
  const { title: routeChatId } = useParams();

  const getChat = useCallback(async () => {
    try {
      const response = await API.get(`/voice/${routeChatId}`);
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
        router.replace("/voice/new");
      }
    }
  }, [routeChatId]);

  useEffect(() => {
    if (!hasLoadedChat && pathname !== "/voice/new") {
      getChat().then(() => setHasLoadedChat(true));
    }
  }, [getChat, pathname, hasLoadedChat]);

  const createMessage = ({ type, content, isTemporary = false }) => ({
    type,
    content,
    timestamp: new Date().toLocaleTimeString(),
    ...(isTemporary && { isTemporary: true }),
  });

  async function handleVoiceInput(voiceText) {
    if (!voiceText.trim()) return;

    const userTime = Date.now();

    const newUserMessage = {
      type: "user",
      content: voiceText,
      timestamp: new Date(userTime).toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsProcessing(true);

    const thinkingMessage = createMessage({
      type: "bot",
      content: "Thinking...",
      isTemporary: true,
    });

    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      const payload = {
        prompt: voiceText,
        userTime,
      };
      if (routeChatId !== "new") {
        payload.chatId = routeChatId;
      }

      const response = await API.post(`/voice`, payload);
      const newChatId = response.data.chat.chatId;

      if (pathname === "/voice/new") {
        router.replace(`/voice/${newChatId}`, undefined, { shallow: true });
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

      // Speak the AI response
      setTimeout(() => {
        speakText(response.data.respond);
      }, 500);
    } catch (error) {
      const errorMessage = createMessage({
        type: "error",
        content: "Something went wrong. Please try again.",
      });

      console.error(error);
      setMessages((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((m) => m.isTemporary);
        if (index !== -1) updated[index] = errorMessage;
        return updated;
      });
    } finally {
      setIsProcessing(false);
    }
  }

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
            How can I help you today? Tap the microphone and start speaking.
          </p>
          <div className="space-y-3 text-sm text-[var(--text-muted)]">
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-[var(--text-primary)] rounded-full"></span>
              Speak naturally about any topic
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-[var(--text-primary)] rounded-full"></span>
              Get voice responses instantly
            </p>
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

      {/* Voice Input Area */}
      <div className="sticky bottom-0 p-6 lg:p-8">
        <div className="flex items-center justify-center gap-4 bg-[var(--surface)] rounded-2xl px-6 py-4 shadow-xl">
          {/* Voice control button */}
          <div className="flex items-center gap-4">
            {isListening ? (
              <button
                onClick={stopListening}
                className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-all duration-200 shadow-md animate-pulse"
              >
                <MicOff size={24} />
              </button>
            ) : (
              <button
                onClick={() => !isProcessing && !isSpeaking && startListening()}
                disabled={isProcessing || isSpeaking}
                className={`p-4 rounded-full transition-all duration-200 shadow-md ${
                  isProcessing || isSpeaking
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                <Mic size={24} />
              </button>
            )}

            {/* Speaking control */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="bg-orange-500 text-white p-4 rounded-full hover:bg-orange-600 transition-all duration-200 shadow-md"
              >
                <Square size={24} />
              </button>
            )}
          </div>

          {/* Status indicator */}
          <div className="flex-1 text-center">
            {isListening && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[var(--text-muted)]">
                  Listening...
                </span>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[var(--text-muted)]">
                  Processing...
                </span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center justify-center gap-2">
                <Volume2 size={16} className="text-orange-500" />
                <span className="text-sm text-[var(--text-muted)]">
                  Speaking...
                </span>
              </div>
            )}
            {!isListening && !isProcessing && !isSpeaking && (
              <span className="text-sm text-[var(--text-muted)]">
                Tap the microphone to speak
              </span>
            )}
          </div>

          {/* Current transcript preview */}
          {transcript && (
            <div className="flex-1 text-center">
              <span className="text-sm text-[var(--text-primary)] italic">
                "{transcript}"
              </span>
            </div>
          )}
        </div>

        {/* Browser support warning */}
        {!isSupported && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
            <p className="text-sm text-yellow-800">
              Voice recognition is not supported in your browser. Please use
              Chrome, Edge, or Safari.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChatArea;
