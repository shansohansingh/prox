
const ToggleButton = ({ label, description, enabled = true, onToggle }) => (
  <div className="space-y-3">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <label className="text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
        {description && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${
          enabled ? "bg-[var(--text-primary)] shadow-sm" : "bg-[var(--border)]"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-200 ${
            enabled
              ? "translate-x-6 bg-[var(--surface)]"
              : "translate-x-1 bg-[var(--text-primary)]"
          } shadow-sm`}
        />
      </button>
    </div>
  </div>
);
export default ToggleButton