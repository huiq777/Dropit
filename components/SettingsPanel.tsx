"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { Settings, X, Globe, Bell, Sliders, Info, ArrowBigDownDash } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#2d2d2d] rounded-2xl border border-[#404040] w-full max-w-sm max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#404040]">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            {t("common.settings")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-4 space-y-6">
          {/* Language Settings */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              {t("common.language")}
            </h3>
            <div className="bg-[#1a1a1a] rounded-xl p-3 border border-[#404040]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Interface Language
                </span>
                <LanguageToggle className="text-sm" />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="bg-[#1a1a1a] rounded-xl p-3 border border-[#404040]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">
                      Desktop Notifications
                    </div>
                    <div className="text-xs text-gray-400">
                      Get notified of new messages
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                      notifications ? "bg-[#6366f1]" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        notifications ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3 flex items-center">
              <Sliders className="w-4 h-4 mr-2" />
              App Settings
            </h3>
            <div className="space-y-3">
              <div className="bg-[#1a1a1a] rounded-xl p-3 border border-[#404040]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">
                      Auto Save
                    </div>
                    <div className="text-xs text-gray-400">
                      Automatically save drafts
                    </div>
                  </div>
                  <button
                    onClick={() => setAutoSave(!autoSave)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                      autoSave ? "bg-[#6366f1]" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        autoSave ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl p-3 border border-[#404040]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">
                      Show Timestamps
                    </div>
                    <div className="text-xs text-gray-400">
                      Display message timestamps
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTimestamps(!showTimestamps)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                      showTimestamps ? "bg-[#6366f1]" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        showTimestamps ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              About
            </h3>
            <div className="bg-[#1a1a1a] rounded-xl p-3 border border-[#404040] text-center">
              <div className="w-12 h-12 bg-[#6366f1] rounded-xl flex items-center justify-center mx-auto mb-3">
                <ArrowBigDownDash className="text-white w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-white mb-1">Dropit</div>
              <div className="text-xs text-gray-400 mb-2">v1.0.0</div>
              <div className="text-xs text-gray-500">
                Secure temporary file sharing
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#404040]">
          <button
            onClick={onClose}
            className="w-full bg-[#6366f1] hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-xl transition-colors cursor-pointer"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
