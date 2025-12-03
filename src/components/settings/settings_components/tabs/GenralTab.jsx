import React from "react";
import SettingSelect from "../UI/Select";
import { Play } from "lucide-react";
import ToggleButton from "../UI/ToggleButton";

export default function GenralTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        General Settings
      </h3>
      {/* Language */}
    <div className="flex items-center gap-3">
        <SettingSelect
        label="Language"
        options={["English", "Spanish", "French", "German"]}
      />
    </div>
      {/* Voice */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-[var(--text-primary)]">
            Voice
          </label>
          <div className="flex items-center gap-3">
            <button className="bg-[var(--surface-elevated)] rounded-xl px-4 py-2.5 pr-10 text-[var(--text-primary)] text-sm transition-all duration-200 w-full sm:min-w-[140px] sm:w-auto shadow-sm flex items-center gap-2 mt-3">
              <Play size={14} />
              Play
            </button>
            <SettingSelect options={["Alloy", "Echo", "Fable", "Onyx"]} />
          </div>
        </div>
      </div>
      {/* Follow up Toggle */}
      <ToggleButton label="Show follow up suggestions" />
      {/* Theme Toggle */}
    </div>
  );
}
