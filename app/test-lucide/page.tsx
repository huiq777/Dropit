"use client";

import { 
  Send, 
  LogIn, 
  Loader2, 
  Type, 
  Copy, 
  Upload, 
  Settings, 
  Trash2,
  Image,
  FileText,
  File,
  Download,
  Check,
  X,
  Plus,
  Bell,
  Sliders,
  Info,
  Globe
} from "lucide-react";

export default function TestLucide() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <h1 className="text-2xl mb-8">Lucide React Icon Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-4">
          <Send className="text-[#6366f1] w-6 h-6" />
          <span>Send (Paper plane)</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <LogIn className="text-green-500 w-6 h-6" />
          <span>Log In</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Loader2 className="text-blue-500 w-6 h-6 animate-spin" />
          <span>Loading Spinner</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Type className="text-yellow-500 w-6 h-6" />
          <span>Text/Font</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Copy className="text-purple-500 w-6 h-6" />
          <span>Copy</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Upload className="text-red-500 w-6 h-6" />
          <span>Upload</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Settings className="text-gray-500 w-6 h-6" />
          <span>Settings</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Trash2 className="text-red-600 w-6 h-6" />
          <span>Trash</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Image className="text-pink-500 w-6 h-6" />
          <span>Image</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <FileText className="text-orange-500 w-6 h-6" />
          <span>File Text</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <File className="text-blue-400 w-6 h-6" />
          <span>File</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Download className="text-indigo-500 w-6 h-6" />
          <span>Download</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Check className="text-green-600 w-6 h-6" />
          <span>Check</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <X className="text-red-400 w-6 h-6" />
          <span>Close</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Plus className="text-cyan-500 w-6 h-6" />
          <span>Plus</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Bell className="text-amber-500 w-6 h-6" />
          <span>Bell</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Sliders className="text-teal-500 w-6 h-6" />
          <span>Sliders</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Info className="text-sky-500 w-6 h-6" />
          <span>Info</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Globe className="text-emerald-500 w-6 h-6" />
          <span>Globe</span>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-[#2d2d2d] rounded-lg">
        <p className="text-sm text-gray-400">
          If you can see colorful icons next to the text labels, Lucide React is working correctly.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Access this test at: <code>http://localhost:3000/test-lucide</code>
        </p>
      </div>
    </div>
  );
}