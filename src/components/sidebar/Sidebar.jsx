import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  MessageCircle,
  Settings,
  Bot,
  LogIn,
  UserPlus,
  X,
  Image,
  Palette,
  Mic,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import API from "@/contexts/API";
import { getTimeAgo, groupChatsByDate } from "@/contexts/CallBack";

const Sidebar = ({ onSettingsClick, onClose }) => {
  const location = usePathname();
  const [token, setToken] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [imageHistory, setImageHistory] = useState([]);
  const { title } = useParams();

  useEffect(() => {
    const fetchToken = async () => {
      const res = await API.get(`/get-token`);
      setToken(res.data.token);
    };
    fetchToken();
  }, []);

  const getChatHistory = useCallback(async () => {
    try {
      const response = await API.get(`/chat/user`);
      setChatHistory(response.data.chats);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getChatHistory();
  }, [getChatHistory]);

  const getImageHistory = useCallback(async () => {
    try {
      const response = await API.get(`/image-generations/user`);
      setImageHistory(response.data.chats);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getImageHistory();
  }, [getImageHistory]);

  const currentHistory = location.startsWith("/image")
    ? imageHistory
    : chatHistory;
  const groupedItems = groupChatsByDate(currentHistory);

  return (
    <div className="w-64 bg-[var(--surface)] flex flex-col h-full shadow-lg">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--text-primary)] rounded-xl flex items-center justify-center">
              <Bot size={18} className="text-[var(--bg)]" />
            </div>
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">
              ChatBot AI
            </h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* New button */}
      <div className="px-6 pb-6">
        <Link
          href={location.startsWith("/image") ? "/image/new" : "/chat/new"}
          className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--text-primary)] text-[var(--bg)] rounded-xl hover:opacity-95 transition-all duration-200 font-medium"
        >
          <Plus size={20} />
          {location.startsWith("/image") ? "New Image" : "New Chat"}
        </Link>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex bg-[var(--surface-elevated)] rounded-xl p-1 shadow-md">
          <Link
            href="/chat/new"
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              location.startsWith("/chat")
                ? "bg-[var(--text-primary)] text-[var(--bg)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <MessageCircle size={16} />
          </Link>
          {/* <Link
            href="/image/new"
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              location.startsWith("/image")
                ? "bg-[var(--text-primary)] text-[var(--bg)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Image size={16} />
          </Link>
          <Link
            href="/voice/new"
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              location.startsWith("/voice")
                ? "bg-[var(--text-primary)] text-[var(--bg)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Mic size={16} />
          </Link> */}
        </div>
      </div>

      {/* History */}
      <div className="flex-1 px-6 overflow-y-auto">
        <h3 className="text-[var(--text-muted)] text-xs font-medium mb-3 uppercase tracking-wide">
          {location.startsWith("/image") ? "Images" : "Chats"}
        </h3>
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <div key={groupName} className="mb-6">
            <h3 className="text-[var(--text-muted)] text-xs font-medium mb-3 uppercase tracking-wide">
              {groupName}
            </h3>
            <div className="space-y-1">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={
                    location.startsWith("/image")
                      ? `/image/${item.chatId}`
                      : `/chat/${item.chatId}`
                  }
                  className={`w-full flex flex-col gap-1 px-3 py-3 text-[var(--text-primary)] hover:bg-[var(--bg)] rounded-lg transition-all duration-200 text-left group relative ${
                    item.chatId === title
                      ? "bg-[var(--surface-elevated)] shadow-md"
                      : "shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {location.startsWith("/image") ? (
                      <Palette
                        size={16}
                        className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
                      />
                    ) : (
                      <MessageCircle
                        size={16}
                        className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
                      />
                    )}
                    <span className="truncate text-sm">{item.title}</span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] ml-7">
                    {getTimeAgo(item?.createdAt)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Settings/Auth */}
      <div className="p-6 space-y-2">
        {token ? (
          <button
            onClick={onSettingsClick}
            className="w-full flex items-center gap-3 px-3 py-3 bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] rounded-xl transition-all duration-200 shadow-lg"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        ) : (
          <>
            <Link
              href={`/auth/login`}
              className="w-full flex items-center gap-3 px-3 py-3 bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] rounded-xl transition-all duration-200 shadow-lg"
            >
              <LogIn size={18} />
              <span className="text-sm">Sign In</span>
            </Link>
            <Link
              href={`/auth/register`}
              className="w-full flex items-center gap-3 px-3 py-3 bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] rounded-xl transition-all duration-200 shadow-lg"
            >
              <UserPlus size={18} />
              <span className="text-sm">Sign Up</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
