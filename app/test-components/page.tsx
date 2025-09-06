"use client";

import { Send, Loader2, LogIn, AlertCircle, Plus, Type, Check, Copy, Image, FileText, File, Download, Settings, X, Globe, Bell, Sliders, Info, Upload, Trash2 } from "lucide-react";

export default function TestComponents() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <h1 className="text-2xl mb-8">Component Icons Test</h1>
      
      <div className="space-y-8">
        {/* Auth Form Icons */}
        <div className="bg-[#2d2d2d] p-4 rounded-lg">
          <h2 className="text-lg mb-4">AuthForm Icons</h2>
          <div className="flex items-center space-x-4 mb-2">
            <Send className="text-white w-8 h-8 -rotate-45" />
            <span>Send (Logo)</span>
          </div>
          <div className="flex items-center space-x-4 mb-2">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span>Loading Spinner</span>
          </div>
          <div className="flex items-center space-x-4 mb-2">
            <LogIn className="w-4 h-4 mr-2" />
            <span>Login Button</span>
          </div>
          <div className="flex items-center space-x-4">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Error Alert</span>
          </div>
        </div>

        {/* Chat Icons */}
        <div className="bg-[#2d2d2d] p-4 rounded-lg">
          <h2 className="text-lg mb-4">Chat Icons</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Type className="text-blue-400 w-3 h-3" />
              <span>Text Type</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Check</span>
            </div>
            <div className="flex items-center space-x-2">
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Image</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>File Text</span>
            </div>
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4" />
              <span>File</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </div>
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Plus</span>
            </div>
          </div>
        </div>

        {/* Interface Icons */}
        <div className="bg-[#2d2d2d] p-4 rounded-lg">
          <h2 className="text-lg mb-4">Interface Icons</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
            <div className="flex items-center space-x-2">
              <X className="w-4 h-4" />
              <span>Close</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Globe</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Bell</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4" />
              <span>Sliders</span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4" />
              <span>Info</span>
            </div>
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Trash</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-[#2d2d2d] rounded-lg">
        <p className="text-sm text-gray-400">
          ✅ All components now use Lucide React icons instead of FontAwesome
        </p>
        <p className="text-sm text-gray-400 mt-2">
          This tests all the icons used across AuthForm, ChatMessage, ChatInput, UploadProgress, SettingsPanel, and MainChatInterface components.
        </p>
      </div>
    </div>
  );
}