import { AlertTriangle, LogOut, Smartphone, Trash2 } from "lucide-react";
import React from "react";

export default function SecurityTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Security Settings
      </h3>

      {/* Change Password */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-[var(--text-primary)]">
          Change Password
        </h4>
        {["Current password", "New password", "Confirm new password"].map(
          (ph, i) => (
            <input
              key={i}
              type="password"
              placeholder={ph}
              className="w-full px-4 py-2.5 bg-[var(--surface)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] shadow-md"
            />
          )
        )}
        <button className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] rounded-xl shadow-md hover:bg-[var(--text-muted)] transition-colors">
          Update Password
        </button>
      </div>

      {/* Session Management */}
      <div className="space-y-4 pt-6">
        <h4 className="text-md font-medium text-[var(--text-primary)]">
          Session Management
        </h4>
        {[
          {
            label: "Sign out",
            sub: "Sign out from this device",
            icon: LogOut,
            action: () => console.log("Sign out clicked"),
          },
          {
            label: "Sign out all devices",
            sub: "End all active sessions",
            icon: Smartphone,
            action: () => console.log("Sign out all clicked"),
          },
        ].map(({ label, sub, icon: Icon, action }, i) => (
          <button
            key={i}
            onClick={action}
            className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--surface)] rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg)] shadow-md transition-all"
          >
            <Icon size={18} />
            <div className="text-left">
              <div className="font-medium">{label}</div>
              <div className="text-xs text-[var(--text-muted)]">{sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="space-y-4 pt-6">
        <h4 className="text-md font-medium text-red-500 flex items-center gap-2">
          <AlertTriangle size={18} />
          Danger Zone
        </h4>
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--surface)] rounded-xl text-red-500 hover:bg-red-50 shadow-md transition-all">
          <Trash2 size={18} />
          <div className="text-left">
            <div className="font-medium">Delete Account</div>
            <div className="text-xs text-red-400">
              Permanently delete your account and all data
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
