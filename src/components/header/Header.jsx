import { ChevronDown, Image, Menu, MessageCircle, Mic } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ onMenuClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("chat");
  const location = usePathname();

  const modes = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "image", label: "Image", icon: Image },
    { id: "voice", label: "Voice", icon: Mic },
  ];

  useEffect(() => {
    const item = location.startsWith("/image")
      ? "image"
      : location.startsWith("/voice")
      ? "voice"
      : "chat";

    setSelectedMode(item);
    setIsDropdownOpen(false);
  }, [location]);

  const selectedModeData =
    modes.find((mode) => mode.id === selectedMode) || modes[0];
  const SelectedIcon = selectedModeData.icon;

  return (
    <div className="sticky top-0 z-10 bg-[var(--surface)] px-6 lg:px-8 py-5 flex items-center justify-between shado">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <SelectedIcon size={20} />
          <span className="font-medium hidden sm:inline">
            {selectedModeData.label}
          </span>
        </div>
      </div>

      <div className="relative">
        {/* <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-4 lg:px-5 py-2.5 bg-[var(--surface-elevated)] rounded-xl hover:bg-[var(--bg)] transition-all duration-200 shadow-sm"
        >
          <SelectedIcon size={18} className="text-[var(--text-primary)]" />
          <span className="text-[var(--text-primary)] font-medium hidden sm:inline">
            {selectedModeData.label}
          </span>
          <ChevronDown
            size={16}
            className={`text-[var(--text-muted)] transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button> */}

        {isDropdownOpen && (
          <div className="absolute overflow-hidden right-0 mt-2 w-56 bg-[var(--surface-elevated)] rounded-xl z-50 shadow-lg">
            <div className="py-2">
              {modes.map((mode) => {
                const Icon = mode.icon;
                const isActive = location.startsWith(`/${mode.id}`);
                return (
                  <Link
                    key={mode.id}
                    href={`/${mode.id}/new`}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg)] rounded-lg mx-2 transition-all duration-200 ${
                      isActive ? "bg-[var(--bg)]" : ""
                    }`}
                  >
                    <Icon size={18} className="text-[var(--text-primary)]" />
                    <span className="text-[var(--text-primary)]">
                      {mode.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
