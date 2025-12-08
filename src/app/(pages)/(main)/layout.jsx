"use client";

import Header from "../../../components/header/Header";
import SettingsModal from "../../../components/settings/SettingsModal";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useEffect, useState } from "react";

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-[var(--bg)] text-[var(--text-primary)] flex overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
        `}
      >
        <Sidebar
          onSettingsClick={() => {
            setIsSettingsOpen(true);
            setIsSidebarOpen(false);
          }}
          onClose={closeSidebar}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex flex-col h-full bg-[var(--bg)]">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          {children}
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
    </div>
  );
}
