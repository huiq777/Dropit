"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { X, Eye, FileText, Film, Music, Archive, File, Download } from "lucide-react";
import Image from "next/image";

interface FilePreviewItem {
  file: File;
  id: string;
  preview?: string;
  status: "pending" | "uploading" | "completed" | "error";
  progress?: number;
  error?: string;
}

interface FilePreviewProps {
  files: FilePreviewItem[];
  onRemoveFile: (fileId: string) => void;
  onStartUpload?: () => void;
  onRetryFile?: (fileId: string) => void;
  maxFileSize?: number;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileType = (file: File): string => {
  const type = file.type.toLowerCase();
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf") || type.includes("document") || type.includes("text")) return "document";
  if (type.includes("zip") || type.includes("rar") || type.includes("tar")) return "archive";
  return "other";
};

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "image":
      return <Eye className="w-4 h-4" />;
    case "video":
      return <Film className="w-4 h-4" />;
    case "audio":
      return <Music className="w-4 h-4" />;
    case "document":
      return <FileText className="w-4 h-4" />;
    case "archive":
      return <Archive className="w-4 h-4" />;
    default:
      return <File className="w-4 h-4" />;
  }
};

export function FilePreview({ 
  files, 
  onRemoveFile, 
  onStartUpload,
  onRetryFile,
  maxFileSize = 10 * 1024 * 1024 
}: FilePreviewProps) {
  const { t } = useI18n();
  const [selectedFile, setSelectedFile] = useState<FilePreviewItem | null>(null);

  if (files.length === 0) return null;

  const formatMaxSize = formatFileSize(maxFileSize);

  return (
    <div className="bg-[#2d2d2d] rounded-xl border border-[#3a3d4e] p-3 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-medium">
          {t("chat.upload.previewTitle")} ({files.length})
        </h3>
        {onStartUpload && files.some(f => f.status === "pending") && (
          <button
            onClick={onStartUpload}
            className="bg-[#6366f1] hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
          >
            {t("chat.uploadButton")}
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {files.map((fileItem) => {
          const fileType = getFileType(fileItem.file);
          const isImage = fileType === "image";
          const fileSizeValid = fileItem.file.size <= maxFileSize;
          
          return (
            <div
              key={fileItem.id}
              className={`flex items-center space-x-3 p-2 rounded-lg border transition-colors ${
                fileItem.status === "error" || !fileSizeValid
                  ? "border-red-400 bg-red-400/10"
                  : fileItem.status === "completed"
                  ? "border-green-400 bg-green-400/10"
                  : fileItem.status === "uploading"
                  ? "border-blue-400 bg-blue-400/10"
                  : "border-[#404040] bg-[#1a1a1a]"
              }`}
            >
              {/* File Icon/Preview */}
              <div className="flex-shrink-0">
                {isImage && fileItem.preview ? (
                  <div className="w-10 h-10 relative bg-[#404040] rounded overflow-hidden">
                    <Image
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-[#404040] rounded flex items-center justify-center text-gray-400">
                    {getFileIcon(fileType)}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium truncate pr-2">
                    {fileItem.file.name}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    fileItem.status === "error" || !fileSizeValid
                      ? "bg-red-500 text-white"
                      : fileItem.status === "completed"
                      ? "bg-green-500 text-white"
                      : fileItem.status === "uploading"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}>
                    {fileItem.status === "uploading" && fileItem.progress
                      ? `${Math.round(fileItem.progress)}%`
                      : fileItem.status === "completed"
                      ? "✓"
                      : fileItem.status === "error"
                      ? "✗"
                      : !fileSizeValid
                      ? "!"
                      : t("chat.upload.fileTypes." + fileType)
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs ${
                    !fileSizeValid ? "text-red-400" : "text-gray-400"
                  }`}>
                    {formatFileSize(fileItem.file.size)}
                    {!fileSizeValid && (
                      <span className="ml-1">
                        / {t("chat.upload.maxFileSize")}: {formatMaxSize}
                      </span>
                    )}
                  </p>
                  
                  {/* Progress Bar */}
                  {fileItem.status === "uploading" && fileItem.progress !== undefined && (
                    <div className="w-16 bg-[#404040] rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${fileItem.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {fileItem.error && (
                  <p className="text-red-400 text-xs mt-1">{fileItem.error}</p>
                )}
                {!fileSizeValid && (
                  <p className="text-red-400 text-xs mt-1">
                    {t("chat.upload.errors.fileTooLarge")
                      .replace('{{filename}}', fileItem.file.name)
                      .replace('{{maxSize}}', formatMaxSize)
                    }
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                {/* Preview Button for Images */}
                {isImage && (
                  <button
                    onClick={() => setSelectedFile(fileItem)}
                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#404040] rounded"
                    title={t("chat.upload.filePreview")}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                
                {/* Retry Button */}
                {fileItem.status === "error" && onRetryFile && (
                  <button
                    onClick={() => onRetryFile(fileItem.id)}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors p-1 hover:bg-[#404040] rounded text-xs"
                    title={t("chat.upload.retryUpload")}
                  >
                    ↻
                  </button>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={() => onRemoveFile(fileItem.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1 hover:bg-[#404040] rounded"
                  title={t("chat.upload.removeFile")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Preview Modal */}
      {selectedFile && selectedFile.preview && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFile(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-[#2d2d2d] rounded-xl border border-[#404040] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#404040]">
              <h3 className="text-white font-medium truncate pr-4">
                {selectedFile.file.name}
              </h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#404040] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative max-h-[70vh] overflow-auto">
              <Image
                src={selectedFile.preview}
                alt={selectedFile.file.name}
                width={800}
                height={600}
                className="object-contain w-full h-auto"
                unoptimized
              />
            </div>
            <div className="p-4 border-t border-[#404040] flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {formatFileSize(selectedFile.file.size)}
                </p>
                <p className="text-gray-400 text-xs">
                  {selectedFile.file.type}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}