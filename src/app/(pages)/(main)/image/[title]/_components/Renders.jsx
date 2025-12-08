import {
  Send,
  Sparkles,
  User,
  Bot,
  Download,
  Copy,
  MoreHorizontal,
  Smile,
} from "lucide-react";
export const renderWelcomeScreen = () => {
  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 18) greeting = "Good afternoon";

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[var(--border)] shadow-md rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
          {greeting}! ✨
        </h2>
        <p className="text-[var(--text-muted)] text-lg mb-8">
          Ready to create amazing images? Describe what you'd like to generate
          and I'll bring your vision to life.
        </p>
        <div className="space-y-3 text-sm text-[var(--text-muted)]">
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
            Try: "A serene lake at sunset"
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
            Try: "Abstract art with vibrant colors"
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
            Try: "Futuristic city with neon lights"
          </p>
        </div>
      </div>
    </div>
  );
};

export const renderUserMessage = (message) => (
  <div className="flex justify-end mb-6">
    <div className="flex items-start gap-4 max-w-2xl">
      <div className="flex flex-col items-end text-right">
        <div className="flex items-center gap-2 mb-2 justify-end">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            You
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            {message.timestamp}
          </span>
        </div>
        <div className="bg-[var(--surface)] rounded-2xl rounded-tr-md px-4 py-3 shadow-md">
          <p className="text-[var(--text-primary)] leading-relaxed">
            {message.prompt}
          </p>
        </div>
      </div>

      <div className="w-10 h-10 bg-[var(--border)] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
        <User size={18} className="text-[var(--text-primary)]" />
      </div>
    </div>
  </div>
);

export const renderAssistantMessage = (message) => (
  <div className="flex justify-start mb-6">
    <div className="flex items-start gap-4 max-w-2xl">
      <div className="w-10 h-10 bg-[var(--border)] shadow-md rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <Bot size={18} className="text-white" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Assistant
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            {message.timestamp}
          </span>
        </div>

        <div className="bg-[var(--surface)] rounded-4xl rounded-tl-none overflow-hidden shadow-md inline-block w-fit max-w-[90vw]">
          <div className="relative group">
            <div className="bg-[var(--surface-elevated)] rounded-xl w-fit max-w-sm">
              <img
                src={message?.image}
                alt={message?.image}
                className="object-contain w-auto h-auto max-w-sm max-h-96"
              />

              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-3">
                  <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-xl">
                    <Download size={18} className="text-gray-700" />
                  </button>
                  <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-xl">
                    <Copy size={18} className="text-gray-700" />
                  </button>
                  <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-xl">
                    <MoreHorizontal size={18} className="text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const renderGeneratingMessage = () => (
  <div className="flex items-start gap-4 mb-6">
    <div className="w-10 h-10 bg-[var(--border)] shadow-md rounded-full flex items-center justify-center flex-shrink-0 mt-1">
      <Bot size={18} className="text-white" />
    </div>
    <div className="flex-1 max-w-2xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          Assistant
        </span>
        <span className="text-xs text-[var(--text-muted)]">generating...</span>
      </div>
      <div className="bg-[var(--surface)] rounded-2xl rounded-tl-md overflow-hidden shadow-md">
        <div className="w-full h-64 bg-[var(--surface-elevated)] animate-pulse shadow-sm">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin mb-2">
                <Sparkles
                  size={24}
                  className="text-[var(--text-muted)] mx-auto"
                />
              </div>
              <p className="text-sm text-[var(--text-muted)]">Generating...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
