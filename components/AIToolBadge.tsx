import * as React from "react";
import { Sparkles, Code2, Github, MessageSquare, Zap, Terminal } from "lucide-react";

interface AIToolBadgeProps {
  tool: string;
  onClick?: (e: React.MouseEvent) => void;
  size?: "sm" | "md" | "lg";
}

const AI_TOOL_STYLES: Record<string, { gradient: string; text: string; icon: React.ReactNode }> = {
  "Claude Code": {
    gradient: "bg-gradient-to-r from-purple-500 to-indigo-600",
    text: "text-white",
    icon: <Sparkles className="w-3 h-3" />,
  },
  "Cursor": {
    gradient: "bg-gradient-to-r from-blue-500 to-cyan-600",
    text: "text-white",
    icon: <Code2 className="w-3 h-3" />,
  },
  "GitHub Copilot": {
    gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
    text: "text-white",
    icon: <Github className="w-3 h-3" />,
  },
  "ChatGPT": {
    gradient: "bg-gradient-to-r from-teal-500 to-cyan-600",
    text: "text-white",
    icon: <MessageSquare className="w-3 h-3" />,
  },
  "Codex": {
    gradient: "bg-gradient-to-r from-orange-500 to-red-600",
    text: "text-white",
    icon: <Code2 className="w-3 h-3" />,
  },
  "Windsurf": {
    gradient: "bg-gradient-to-r from-sky-500 to-blue-600",
    text: "text-white",
    icon: <Zap className="w-3 h-3" />,
  },
  "Replit Agent": {
    gradient: "bg-gradient-to-r from-amber-500 to-orange-600",
    text: "text-white",
    icon: <Terminal className="w-3 h-3" />,
  },
  "Codeium": {
    gradient: "bg-gradient-to-r from-violet-500 to-purple-600",
    text: "text-white",
    icon: <Code2 className="w-3 h-3" />,
  },
  "Tabnine": {
    gradient: "bg-gradient-to-r from-pink-500 to-rose-600",
    text: "text-white",
    icon: <Code2 className="w-3 h-3" />,
  },
  "Amazon CodeWhisperer": {
    gradient: "bg-gradient-to-r from-yellow-500 to-amber-600",
    text: "text-white",
    icon: <Code2 className="w-3 h-3" />,
  },
};

const DEFAULT_STYLE = {
  gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
  text: "text-white",
  icon: <Code2 className="w-3 h-3" />,
};

function AIToolBadge({ tool, onClick, size = "md" }: AIToolBadgeProps) {
  const style = AI_TOOL_STYLES[tool] || DEFAULT_STYLE;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1",
    lg: "px-3 py-1.5 text-sm gap-1.5",
  };

  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center rounded-full font-medium
        ${style.gradient} ${style.text} ${sizeClasses[size]}
        ${onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}
        shadow-sm
      `}
    >
      {style.icon}
      <span>{tool}</span>
    </span>
  );
}

export default AIToolBadge;
