"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { Plus, ArrowBigDownDash, Upload, Camera, Image as ImageIcon, Paperclip, X } from "lucide-react";
import { FilePreview } from "./FilePreview";

interface FilePreviewItem {
  file: File;
  id: string;
  preview?: string;
  status: "pending" | "uploading" | "completed" | "error";
  progress?: number;
  error?: string;
}

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onFileUpload: (file: File) => void;
  onMultipleFileUpload?: (files: File[]) => void;
}

export function ChatInput({ onSendMessage, onFileUpload, onMultipleFileUpload }: ChatInputProps) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FilePreviewItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create file preview URL
  const createFilePreview = useCallback((file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, []);

  // Generate unique ID
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }, []);

  // Validate file
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'text/plain', 'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav',
      'application/zip', 'application/x-rar-compressed'
    ];

    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: t('chat.upload.errors.fileTooLarge')
          .replace('{{filename}}', file.name)
          .replace('{{maxSize}}', '10MB')
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: t('chat.upload.errors.unsupportedType')
          .replace('{{type}}', file.type) 
      };
    }

    return { valid: true };
  }, [t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesSelected(Array.from(files));
    }
    // Reset input
    e.target.value = "";
  };

  const handleFilesSelected = useCallback((files: File[]) => {
    const newFiles: FilePreviewItem[] = [];
    
    files.forEach(file => {
      const validation = validateFile(file);
      const fileItem: FilePreviewItem = {
        file,
        id: generateId(),
        preview: createFilePreview(file),
        status: validation.valid ? 'pending' : 'error',
        error: validation.error
      };
      newFiles.push(fileItem);
    });
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, [validateFile, createFilePreview, generateId]);

  // Handle paste events for files
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files: File[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // Support images and other file types
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    
    if (files.length > 0) {
      e.preventDefault();
      handleFilesSelected(files);
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
      handleFilesSelected(Array.from(files));
    }
  };

  // Handle file removal from preview
  const handleRemoveFile = useCallback((fileId: string) => {
    setSelectedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  // Handle upload start
  const handleStartUpload = useCallback(async () => {
    const pendingFiles = selectedFiles.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    // Update status to uploading
    setSelectedFiles(prev => prev.map(f => 
      f.status === 'pending' ? { ...f, status: 'uploading' as const, progress: 0 } : f
    ));

    // Upload files one by one or use multiple upload if available
    if (onMultipleFileUpload && pendingFiles.length > 1) {
      try {
        await onMultipleFileUpload(pendingFiles.map(f => f.file));
        // Clear files after successful upload
        setTimeout(() => setSelectedFiles([]), 1000);
      } catch (error) {
        console.error('Multiple upload failed:', error);
      }
    } else {
      // Single file uploads
      for (const fileItem of pendingFiles) {
        try {
          await onFileUpload(fileItem.file);
          setSelectedFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, status: 'completed' as const, progress: 100 } : f
          ));
        } catch (error) {
          setSelectedFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { 
              ...f, 
              status: 'error' as const, 
              error: t('chat.upload.errors.uploadFailed')
            } : f
          ));
        }
      }
      // Clear completed files after delay
      setTimeout(() => {
        setSelectedFiles(prev => prev.filter(f => f.status !== 'completed'));
      }, 2000);
    }
  }, [selectedFiles, onFileUpload, onMultipleFileUpload, t]);

  // Handle camera capture
  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

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
          <div className="bg-[#6366f1] text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>{t("chat.upload.dropFilesHere")}</span>
          </div>
        </div>
      )}

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <FilePreview
          files={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onStartUpload={handleStartUpload}
          maxFileSize={10 * 1024 * 1024}
        />
      )}

      <div className="bg-[#2d2d2d] rounded-2xl border border-[#3a3d4e] p-4 shadow-md"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={t("chat.inputPlaceholder")}
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none text-sm leading-normal min-h-[30px]"
              rows={1}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* File Upload Button */}
              <button
                type="button"
                onClick={handleFileSelect}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-[#404040]"
                title={t("chat.upload.selectFiles")}
              >
                <Paperclip className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">{t("chat.uploadButton")}</span>
              </button>

              {/* Camera Button (Mobile) */}
              {isMobile && (
                <button
                  type="button"
                  onClick={handleCameraCapture}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-[#404040]"
                  title={t("chat.upload.takePhoto")}
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}

              {/* Upload Hint */}
              <div className="hidden md:flex items-center text-xs text-gray-500">
                <span>
                  {typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac') 
                    ? t("chat.upload.pasteMacToUpload")
                    : t("chat.upload.pasteToUpload")
                  }
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-[#6366f1] hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-7 py-1.5 rounded-xl transition-all duration-200 flex items-center space-x-1 cursor-pointer disabled:cursor-not-allowed font-medium text-sm shadow-sm hover:shadow-md disabled:shadow-none"
            >
              <span className="text-xl">Drop</span>
              <ArrowBigDownDash className="w-8 h-8" />
            </button>
          </div>
        </form>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.txt,.zip,.rar,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Hidden camera input (Mobile) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
