"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Type, Check, Copy, Image, FileText, File, Download, AlertCircle } from "lucide-react";

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
  const [copyError, setCopyError] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "success" | "error">("idle");

  const handleCopy = async () => {
    try {
      setCopyError(false);
      let textToCopy: string;
      
      if (message.type === "file") {
        // For file messages, copy the file URL for easy access
        textToCopy = message.fileData?.url || message.content;
      } else {
        // For text messages, copy the content
        textToCopy = message.content;
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Extended feedback time
    } catch (err) {
      console.error("Failed to copy:", err);
      // Show error feedback to user
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const handleDownload = async () => {
    if (!message.fileData?.url) return;
    
    try {
      setDownloadStatus("downloading");
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = message.fileData.url;
      link.download = message.fileData.filename || 'download';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadStatus("success");
      setTimeout(() => setDownloadStatus("idle"), 2000);
    } catch (err) {
      console.error("Download failed:", err);
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus("idle"), 3000);
      
      // Fallback: open in new tab if download fails
      try {
        window.open(message.fileData.url, '_blank', 'noopener,noreferrer');
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
      }
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
      <div className="group relative bg-gradient-to-br from-[#2a2d3e] to-[#252837] rounded-2xl p-1 border border-[#3a3d4e] shadow-lg hover:shadow-xl hover:border-[#4a4d5e] transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 flex-shrink-0">
              <Type className="text-white w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="text-white font-medium text-sm break-all whitespace-pre-wrap leading-relaxed">
                {message.content}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={handleCopy}
              className={`opacity-0 group-hover:opacity-100 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                copySuccess 
                  ? "text-green-400 bg-green-400/10" 
                  : copyError
                  ? "text-red-400 bg-red-400/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              title={copySuccess ? "Copied!" : copyError ? "Copy failed" : "Copy text"}
            >
              {copySuccess ? (
                <Check className="w-4 h-4" />
              ) : copyError ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className="group relative bg-gradient-to-br from-[#2a2d3e] to-[#252837] rounded-2xl p-1 border border-[#3a3d4e] shadow-lg hover:shadow-xl hover:border-[#4a4d5e] transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div
            className={`w-12 h-12 ${iconStyle.bg} rounded-2xl flex items-center justify-center shadow-lg border border-white/10 flex-shrink-0`}
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
          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className="text-white font-medium text-sm break-all mb-1">
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
                : copyError
                ? "text-red-400 bg-red-400/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            title={copySuccess ? "Copied!" : copyError ? "Copy failed" : "Copy text"}
          >
            {copySuccess ? (
              <Check className="w-4 h-4" />
            ) : copyError ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          {message.fileData?.url && (
            <button
              onClick={handleDownload}
              className={`opacity-0 group-hover:opacity-100 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                downloadStatus === "success"
                  ? "text-green-400 bg-green-400/10"
                  : downloadStatus === "error"
                  ? "text-red-400 bg-red-400/10"
                  : downloadStatus === "downloading"
                  ? "text-blue-400 bg-blue-400/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              title={
                downloadStatus === "success"
                  ? "Downloaded!"
                  : downloadStatus === "error"
                  ? "Download failed"
                  : downloadStatus === "downloading"
                  ? "Downloading..."
                  : "Download file"
              }
              disabled={downloadStatus === "downloading"}
            >
              {downloadStatus === "success" ? (
                <Check className="w-4 h-4" />
              ) : downloadStatus === "error" ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Download className={`w-4 h-4 ${
                  downloadStatus === "downloading" ? "animate-pulse" : ""
                }`} />
              )}
            </button>
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
    </div>
  );
}
