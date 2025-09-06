"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { UploadProgress } from "./UploadProgress";
import { LanguageToggle } from "./LanguageToggle";
import { useI18n } from "@/lib/i18n";
import useSWR from "swr";
import { ArrowBigDownDash, Send, Trash2 } from "lucide-react";

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

interface UploadState {
  fileName: string;
  progress: number;
  isUploading: boolean;
}

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};

export function MainChatInterface() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({
    fileName: "",
    progress: 0,
    isUploading: false,
  });
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Fetch messages with SWR (polling every 3 seconds)
  const { data, error, mutate } = useSWR(
    "/api/content?type=messages",
    fetcher,
    {
      refreshInterval: 3000, // Poll every 3 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  useEffect(() => {
    if (data?.success && data.data) {
      setMessages(data.data);
    }
  }, [data]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback(
    async (content: string, type: "text" | "file" = "text", fileData?: any) => {
      try {
        const response = await fetch("/api/content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            type: "message",
            content,
            messageType: type,
            fileData,
          }),
        });

        if (response.ok) {
          // Trigger re-fetch of messages
          mutate();
          return true;
        }
      } catch (error) {
        console.error("Failed to add message:", error);
      }
      return false;
    },
    [mutate],
  );

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (text.trim()) {
        await addMessage(text.trim());
      }
    },
    [addMessage],
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      setUploadState({
        fileName: file.name,
        progress: 0,
        isUploading: true,
      });

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadState((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + Math.random() * 15, 90),
          }));
        }, 100);

        const response = await fetch("/api/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        clearInterval(progressInterval);

        if (response.ok) {
          const result = await response.json();
          setUploadState((prev) => ({ ...prev, progress: 100 }));

          // Add file message
          await addMessage(result.data.filename, "file", result.data);

          setTimeout(() => {
            setUploadState({
              fileName: "",
              progress: 0,
              isUploading: false,
            });
          }, 1000);
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        setUploadState({
          fileName: "",
          progress: 0,
          isUploading: false,
        });
      }
    },
    [addMessage],
  );

  const clearMessages = useCallback(async () => {
    if (confirm(t("chat.clearConfirm"))) {
      try {
        const response = await fetch("/api/content?type=messages", {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          setMessages([]);
          mutate();
        }
      } catch (error) {
        console.error("Failed to clear messages:", error);
      }
    }
  }, [mutate, t]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // 检查两个时间戳是否在同一天
  const isSameDay = (timestamp1: number, timestamp2: number) => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return date1.toDateString() === date2.toDateString();
  };

  // 按时间段分组消息
  const groupMessagesByTimeSegment = (messages: Message[]) => {
    if (messages.length === 0) return [];

    const TIME_THRESHOLD = 2 * 60 * 1000; // 2分钟阈值
    const groups: { timestamp: number; messages: Message[] }[] = [];

    messages.forEach((message) => {
      const lastGroup = groups[groups.length - 1];

      if (
        !lastGroup ||
        message.timestamp - lastGroup.timestamp > TIME_THRESHOLD ||
        !isSameDay(message.timestamp, lastGroup.timestamp)
      ) {
        // 创建新组
        groups.push({
          timestamp: message.timestamp,
          messages: [message],
        });
      } else {
        // 添加到当前组
        lastGroup.messages.push(message);
      }
    });

    return groups;
  };

  // 对消息进行分组
  const messageGroups = groupMessagesByTimeSegment(messages);


  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-red-400">Failed to load messages</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1a1a1a] text-white flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-[#2d2d2d] border-b border-[#404040] p-4 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center">
            <ArrowBigDownDash className="text-white w-4 h-4" />
          </div>
          <h1 className="text-lg font-semibold text-white">
            {t("chat.title")}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageToggle />
          <button
            onClick={clearMessages}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={t("chat.clearMessages")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 消息区域 - 可滚动的中间部分 */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto" ref={chatAreaRef}>
        {messageGroups.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6366f1]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowBigDownDash className="text-[#6366f1] w-8 h-8" />
              </div>
              <p>{t("chat.emptyStateMessage")}</p>
            </div>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`} className="message-group">
              {/* 时间戳分隔符 */}
              <div className="text-xs text-gray-400 text-center mb-4">
                {formatTimestamp(group.timestamp)}
              </div>
              {/* 消息分组容器 */}
              <div className="space-y-4 mb-8">
                {group.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 固定底部区域 */}
      <div className="flex-shrink-0">
        {/* 上传进度显示区域 */}
        {uploadState.isUploading && (
          <div className="px-4 pb-2">
            <div className="bg-[#2d2d2d]/50 rounded-2xl border border-[#404040] p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#6366f1]/20 rounded-lg flex items-center justify-center">
                  <Upload className="text-[#6366f1] w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium truncate" title={uploadState.fileName}>
                      {uploadState.fileName}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {Math.round(uploadState.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#404040] rounded-full h-2">
                    <div
                      className="bg-[#6366f1] h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 底部输入区域 */}
        <div className="bg-[#2d2d2d] border-t border-[#404040] p-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>

    </div>
  );
}
