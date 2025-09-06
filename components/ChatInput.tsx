"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Plus, ArrowBigDownDash } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onFileUpload: (file: File) => void;
}

export function ChatInput({ onSendMessage, onFileUpload }: ChatInputProps) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        onFileUpload(file);
      });
    }
    // Reset input
    e.target.value = "";
  };

  // Handle paste events for files
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          onFileUpload(file);
        }
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        onFileUpload(file);
      });
    }
  };

  return (
    <>
      {/* Global drag overlay */}
      {isDragOver && (
        <div
          className="fixed inset-0 bg-[#6366f1]/20 backdrop-blur-sm z-20 flex items-center justify-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-[#6366f1] text-white px-6 py-3 rounded-xl font-medium">
            {t("chat.dragDropHint")}
          </div>
        </div>
      )}

      <div className="bg-[#1a1a1a] rounded-2xl border border-[#404040] p-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={t("chat.inputPlaceholder")}
              className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-sm"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleFileSelect}
              className="flex items-center space-x-2 text-[#6366f1] hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t("chat.uploadButton")}
              </span>
            </button>

            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-[#6366f1] hover:bg-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-colors flex items-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <span className="text-sm font-medium">
                Drop
              </span>
              <ArrowBigDownDash className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf,.doc,.docx,.txt,.zip"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
