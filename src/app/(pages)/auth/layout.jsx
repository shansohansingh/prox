"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

export default function Authlayout({ children }) {
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
  return (
    <div>
      <ToastContainer theme={theme} hideProgressBar={true} />
      {children}
    </div>
  );
}
