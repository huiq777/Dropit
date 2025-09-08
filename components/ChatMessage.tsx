"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Type, Check, Copy, Image, FileText, File, Download } from "lucide-react";

interface Message {
  id: string;
  type: "text" | "file";
  content: string;
  timestamp: number;
  fileData?: {
    url: string;
    filename: string;
    size: number;
    type: string;
  };
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { t } = useI18n();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy =
        message.type === "file"
          ? message.fileData?.url || message.content
          : message.content;

      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return "📁";

    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType === "application/pdf") return "📄";
    if (mimeType.startsWith("text/")) return "📝";
    return "📁";
  };

  const getIconColor = (mimeType?: string) => {
    if (!mimeType) return { bg: "bg-gray-600/20", icon: "text-gray-400" };

    if (mimeType.startsWith("image/")) {
      return { bg: "bg-purple-600/20", icon: "text-purple-400" };
    }
    if (mimeType === "application/pdf") {
      return { bg: "bg-red-600/20", icon: "text-red-400" };
    }
    if (mimeType.startsWith("text/")) {
      return { bg: "bg-blue-600/20", icon: "text-blue-400" };
    }
    return { bg: "bg-gray-600/20", icon: "text-gray-400" };
  };

  const iconStyle = getIconColor(message.fileData?.type);


  if (message.type === "text") {
    return (
      <div className="group relative bg-gradient-to-br from-[#2a2d3e] to-[#252837] rounded-2xl p-3 border border-[#3a3d4e] shadow-lg hover:shadow-xl hover:border-[#4a4d5e] transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Type className="text-white w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-medium text-blue-300">
                {t("chat.messageTypes.text")}
              </span>
              <div className="w-full border-t border-gray-700 mt-1"></div>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={`opacity-0 group-hover:opacity-100 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
              copySuccess 
                ? "text-green-400 bg-green-400/10" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {copySuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap font-light">
          {message.content}
        </p>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className="group relative bg-gradient-to-br from-[#2a2d3e] to-[#252837] rounded-2xl p-1 border border-[#3a3d4e] shadow-lg hover:shadow-xl hover:border-[#4a4d5e] transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div
            className={`w-12 h-12 ${iconStyle.bg} rounded-2xl flex items-center justify-center shadow-lg border border-white/10`}
          >
            {message.fileData?.type?.startsWith("image/") ? (
              <Image className={`w-6 h-6 ${iconStyle.icon}`} />
            ) : message.fileData?.type === "application/pdf" ? (
              <FileText className={`w-6 h-6 ${iconStyle.icon}`} />
            ) : message.fileData?.type?.startsWith("text/") ? (
              <FileText className={`w-6 h-6 ${iconStyle.icon}`} />
            ) : (
              <File className={`w-6 h-6 ${iconStyle.icon}`} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm truncate mb-1">
              {message.fileData?.filename || message.content}
            </h3>
            <div className="flex items-center space-x-2">
              {message.fileData?.size && (
                <span className="text-xs text-gray-400 bg-gray-700/30 px-2 py-1 rounded-full">
                  {formatFileSize(message.fileData.size)}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {message.fileData?.type?.split("/")[0] || "file"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-4">
          <button
            onClick={handleCopy}
            className={`opacity-0 group-hover:opacity-100 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
              copySuccess 
                ? "text-green-400 bg-green-400/10" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {copySuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          {message.fileData?.url && (
            <a
              href={message.fileData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
    </div>
  );
}
