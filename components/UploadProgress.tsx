"use client";

import { Upload } from "lucide-react";

interface UploadProgressProps {
  fileName: string;
  progress: number;
}

export function UploadProgress({ fileName, progress }: UploadProgressProps) {
  return (
    <div className="px-4 pb-2">
      <div className="bg-[#2d2d2d]/50 rounded-2xl border border-[#404040] p-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#6366f1]/20 rounded-lg flex items-center justify-center">
            <Upload className="text-[#6366f1] w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-white text-sm font-medium truncate"
                title={fileName}
              >
                {fileName}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-[#404040] rounded-full h-2">
              <div
                className="bg-[#f6f6f6] h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
