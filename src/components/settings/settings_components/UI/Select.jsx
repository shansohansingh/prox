import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const SettingSelect = ({ label, description, options = [], value, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <div className="space-y-3" ref={dropdownRef}>
      <div className="flex flex-col gap-3">
        {/* Label + Description */}
        <div>
          {label && (
            <label className="text-sm font-medium text-[var(--text-primary)]">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-[var(--text-muted)] mt-1">{description}</p>
          )}
        </div>

        {/* Custom Dropdown */}
        <div className="relative w-full sm:min-w-[140px] sm:w-auto">
          <button
            onClick={() => setOpen(!open)}
            className="w-full appearance-none bg-[var(--surface-elevated)] rounded-xl px-4 py-2.5 pr-10 text-left text-sm text-[var(--text-primary)] focus:outline-none shadow-sm hover:bg-[var(--surface-elevated)] transition-all duration-200 flex justify-between items-center"
          >
            {value ? value[0].toUpperCase() + value.slice(1) : "Select"}
            <ChevronDown
              size={16}
              className={`ml-2 text-[var(--text-muted)] transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Options List */}
          {open && (
            <div className="absolute z-10 mt-2 w-full bg-[var(--surface)] rounded-xl shadow-lg overflow-hidden animate-fadeIn max-h-60 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface)] transition-all ${
                    opt === value ? "bg-[var(--surface)] font-medium" : ""
                  }`}
                >
                  {opt[0].toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingSelect;
