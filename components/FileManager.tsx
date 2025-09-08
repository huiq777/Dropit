"use client";

import { useState, useEffect, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Download, 
  Trash2, 
  Copy, 
  Eye,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  File,
  Calendar,
  SortAsc,
  SortDesc,
  X
} from "lucide-react";
import Image from "next/image";
import useSWR from "swr";

interface UploadedFile {
  url: string;
  size: number;
  type: string;
  filename: string;
  uploadedAt: number;
  pathname?: string;
}

interface FileManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = "grid" | "list";
type SortBy = "name" | "date" | "size" | "type";
type SortOrder = "asc" | "desc";
type FilterType = "all" | "image" | "document" | "video" | "audio" | "archive" | "other";

const fetcher = async (url: string) => {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileType = (mimeType: string): FilterType => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("text")) return "document";
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar")) return "archive";
  return "other";
};

const getFileIcon = (fileType: FilterType) => {
  const iconClass = "w-5 h-5";
  switch (fileType) {
    case "image": return <ImageIcon className={iconClass} />;
    case "video": return <Film className={iconClass} />;
    case "audio": return <Music className={iconClass} />;
    case "document": return <FileText className={iconClass} />;
    case "archive": return <Archive className={iconClass} />;
    default: return <File className={iconClass} />;
  }
};

export function FileManager({ isOpen, onClose }: FileManagerProps) {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const { data, error, mutate, isLoading } = useSWR(
    isOpen ? "/api/upload" : null,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true
    }
  );

  // Filtered and sorted files
  const processedFiles = useMemo(() => {
    if (!data?.success || !data.data) return [];

    let files: UploadedFile[] = data.data;

    // Apply search filter
    if (searchQuery) {
      files = files.filter(file => 
        file.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      files = files.filter(file => getFileType(file.type) === filterType);
    }

    // Sort files
    files.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.filename.localeCompare(b.filename);
          break;
        case "date":
          comparison = a.uploadedAt - b.uploadedAt;
          break;
        case "size":
          comparison = a.size - b.size;
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return files;
  }, [data, searchQuery, filterType, sortBy, sortOrder]);

  // Handle file selection
  const toggleFileSelection = (fileUrl: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileUrl)) {
      newSelected.delete(fileUrl);
    } else {
      newSelected.add(fileUrl);
    }
    setSelectedFiles(newSelected);
  };

  // Handle bulk operations
  const handleBulkDelete = async () => {
    if (!confirm(t("common.confirm"))) return;
    
    const promises = Array.from(selectedFiles).map(url =>
      fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
        credentials: "include"
      })
    );

    try {
      await Promise.all(promises);
      setSelectedFiles(new Set());
      mutate();
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  };

  // Handle single file operations
  const handleFileDelete = async (url: string) => {
    if (!confirm(t("common.confirm"))) return;

    try {
      await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
        credentials: "include"
      });
      mutate();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleFileCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // Could show a toast notification here
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleFileDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-xl border border-[#3a3d4e] w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3d4e]">
          <h2 className="text-white text-lg font-medium">
            {t("common.upload")} {t("common.settings")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#404040] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3d4e] flex-wrap gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2d2d2d] border border-[#404040] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="bg-[#2d2d2d] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
            >
              <option value="all">{t("common.all")}</option>
              <option value="image">{t("chat.upload.fileTypes.image")}</option>
              <option value="document">{t("chat.upload.fileTypes.document")}</option>
              <option value="video">{t("chat.upload.fileTypes.video")}</option>
              <option value="audio">{t("chat.upload.fileTypes.audio")}</option>
              <option value="archive">{t("chat.upload.fileTypes.archive")}</option>
              <option value="other">{t("chat.upload.fileTypes.other")}</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by as SortBy);
                setSortOrder(order as SortOrder);
              }}
              className="bg-[#2d2d2d] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
            >
              <option value="date-desc">Latest</option>
              <option value="date-asc">Oldest</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="size-desc">Largest</option>
              <option value="size-asc">Smallest</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-[#404040] rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-[#6366f1] text-white" : "text-gray-400 hover:text-white"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-[#6366f1] text-white" : "text-gray-400 hover:text-white"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFiles.size > 0 && (
          <div className="flex items-center justify-between p-4 bg-[#2d2d2d] border-b border-[#3a3d4e]">
            <span className="text-white text-sm">
              {selectedFiles.size} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* File List/Grid */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">Failed to load files</div>
          ) : processedFiles.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No files found</div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {processedFiles.map((file) => (
                <FileGridItem
                  key={file.url}
                  file={file}
                  isSelected={selectedFiles.has(file.url)}
                  onSelect={toggleFileSelection}
                  onPreview={setPreviewFile}
                  onDelete={handleFileDelete}
                  onCopy={handleFileCopy}
                  onDownload={handleFileDownload}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {processedFiles.map((file) => (
                <FileListItem
                  key={file.url}
                  file={file}
                  isSelected={selectedFiles.has(file.url)}
                  onSelect={toggleFileSelection}
                  onPreview={setPreviewFile}
                  onDelete={handleFileDelete}
                  onCopy={handleFileCopy}
                  onDownload={handleFileDownload}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}

// Grid Item Component
function FileGridItem({
  file,
  isSelected,
  onSelect,
  onPreview,
  onDelete,
  onCopy,
  onDownload
}: {
  file: UploadedFile;
  isSelected: boolean;
  onSelect: (url: string) => void;
  onPreview: (file: UploadedFile) => void;
  onDelete: (url: string) => void;
  onCopy: (url: string) => void;
  onDownload: (url: string, filename: string) => void;
}) {
  const fileType = getFileType(file.type);
  const isImage = fileType === "image";

  return (
    <div
      className={`relative bg-[#2d2d2d] border ${
        isSelected ? "border-[#6366f1]" : "border-[#404040]"
      } rounded-lg overflow-hidden hover:border-[#6366f1] transition-colors group`}
    >
      {/* Selection checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(file.url)}
          className="w-4 h-4"
        />
      </div>

      {/* File preview */}
      <div
        className="aspect-square cursor-pointer"
        onClick={() => onPreview(file)}
      >
        {isImage ? (
          <Image
            src={file.url}
            alt={file.filename}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {getFileIcon(fileType)}
          </div>
        )}
      </div>

      {/* File info */}
      <div className="p-2">
        <p className="text-white text-sm font-medium truncate" title={file.filename}>
          {file.filename}
        </p>
        <p className="text-gray-400 text-xs">
          {formatFileSize(file.size)}
        </p>
      </div>

      {/* Actions overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm p-2 flex justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onPreview(file)}
          className="text-white hover:text-[#6366f1] p-1"
          title="Preview"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onCopy(file.url)}
          className="text-white hover:text-[#6366f1] p-1"
          title="Copy URL"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDownload(file.url, file.filename)}
          className="text-white hover:text-[#6366f1] p-1"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(file.url)}
          className="text-white hover:text-red-400 p-1"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// List Item Component  
function FileListItem({
  file,
  isSelected,
  onSelect,
  onPreview,
  onDelete,
  onCopy,
  onDownload
}: {
  file: UploadedFile;
  isSelected: boolean;
  onSelect: (url: string) => void;
  onPreview: (file: UploadedFile) => void;
  onDelete: (url: string) => void;
  onCopy: (url: string) => void;
  onDownload: (url: string, filename: string) => void;
}) {
  const fileType = getFileType(file.type);
  const isImage = fileType === "image";

  return (
    <div
      className={`flex items-center space-x-3 p-3 bg-[#2d2d2d] border ${
        isSelected ? "border-[#6366f1]" : "border-[#404040]"
      } rounded-lg hover:border-[#6366f1] transition-colors group`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(file.url)}
        className="w-4 h-4"
      />

      <div className="w-10 h-10 flex-shrink-0">
        {isImage ? (
          <Image
            src={file.url}
            alt={file.filename}
            width={40}
            height={40}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#404040] rounded">
            {getFileIcon(fileType)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{file.filename}</p>
        <p className="text-gray-400 text-sm">
          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPreview(file)}
          className="text-gray-400 hover:text-white p-1 hover:bg-[#404040] rounded"
          title="Preview"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onCopy(file.url)}
          className="text-gray-400 hover:text-white p-1 hover:bg-[#404040] rounded"
          title="Copy URL"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDownload(file.url, file.filename)}
          className="text-gray-400 hover:text-white p-1 hover:bg-[#404040] rounded"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(file.url)}
          className="text-gray-400 hover:text-red-400 p-1 hover:bg-[#404040] rounded"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Preview Modal Component
function FilePreviewModal({
  file,
  onClose
}: {
  file: UploadedFile;
  onClose: () => void;
}) {
  const fileType = getFileType(file.type);
  const isImage = fileType === "image";

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] bg-[#2d2d2d] rounded-xl border border-[#404040] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#404040]">
          <h3 className="text-white font-medium truncate pr-4">
            {file.filename}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#404040] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="relative max-h-[70vh] overflow-auto">
          {isImage ? (
            <Image
              src={file.url}
              alt={file.filename}
              width={800}
              height={600}
              className="object-contain w-full h-auto"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center p-8 text-gray-400">
              <div className="text-center">
                {getFileIcon(fileType)}
                <p className="mt-2">Preview not available</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-[#404040] flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
            <p className="text-gray-400 text-xs">{file.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}