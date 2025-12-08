import { useState } from "react";
import {
  X,
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  HelpCircle,
  Info,
} from "lucide-react";
import ProfileTab from "./settings_components/tabs/ProfileTab";
import GenralTab from "./settings_components/tabs/GenralTab";
import SecurityTab from "./settings_components/tabs/SecurityTab";
import AppearanceTab from "./settings_components/tabs/AppearanceTab";

const SettingsModal = ({ isOpen, onClose, theme, onThemeToggle }) => {
  const [activeTab, setActiveTab] = useState("profile");

  if (!isOpen) return null;

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "help", label: "Help & Support", icon: HelpCircle },
    { id: "about", label: "About", icon: Info },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "general":
        return <GenralTab />;
      case "security":
        return <SecurityTab />;
      case "appearance":
        return <AppearanceTab theme={theme} onThemeToggle={onThemeToggle} />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-[var(--text-muted)]">
              {tabs.find((t) => t.id === activeTab)?.label} settings coming
              soon...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[var(--bg)] rounded-2xl sm:rounded-3xl w-full max-w-6xl h-[80vh] overflow-hidden flex flex-col shadow-xl">
        {/* Flex container for sidebar + content */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-[var(--surface)] flex flex-col lg:min-h-0">
            {/* Header */}
            <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-between border-b lg:border-b-0 border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Settings
              </h2>
              <button
                onClick={onClose}
                className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-xl hover:bg-[var(--surface-elevated)] transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="lg:hidden px-4 py-3 border-b border-[var(--border)]">
              <div className="flex overflow-x-auto gap-2 pb-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activeTab === id
                        ? "bg-[var(--text-primary)] text-[var(--bg)]"
                        : "text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:flex flex-col flex-1 px-8 pb-6 overflow-y-auto min-h-0">
              <nav className="space-y-2 w-full">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === id
                        ? "bg-[var(--bg)] text-[var(--text-primary)] shadow-md"
                        : "text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Desktop close button */}
            <div className="hidden lg:flex justify-end p-6 pb-2">
              <button
                onClick={onClose}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-xl hover:bg-[var(--surface-elevated)] transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 lg:pt-4 min-h-0">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
