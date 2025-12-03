import React from "react";
import ToggleButton from "../UI/ToggleButton";

export default function AppearanceTab({ theme, onThemeToggle }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Appearance Settings
      </h3>
      <ToggleButton
        label="Dark Mode"
        description="Toggle between light and dark theme"
        enabled={theme === "dark"}
        onToggle={onThemeToggle}
      />
    </div>
  );
}
