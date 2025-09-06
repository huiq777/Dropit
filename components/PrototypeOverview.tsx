"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { PrototypeNavigation } from "./PrototypeNavigation";

interface PrototypePreview {
  id: string;
  component: React.ComponentType;
  path: string;
}

interface PrototypeOverviewProps {
  onPrototypeSelect?: (prototypeId: string) => void;
}

export function PrototypeOverview({
  onPrototypeSelect,
}: PrototypeOverviewProps) {
  const { t } = useI18n();
  const [fullscreenPrototype, setFullscreenPrototype] = useState<string | null>(
    null,
  );

  const openFullscreen = (prototypeId: string) => {
    setFullscreenPrototype(prototypeId);
    if (onPrototypeSelect) {
      onPrototypeSelect(prototypeId);
    }
  };

  const closeFullscreen = () => {
    setFullscreenPrototype(null);
  };

  const prototypes = [
    {
      id: "login",
      title: t("prototype.pages.login.title"),
      description: t("prototype.pages.login.desc"),
      features: t("prototype.pages.login.features"),
      icon: "fas fa-sign-in-alt",
      color: "bg-green-600",
      colorLight: "bg-green-600/20 text-green-400",
    },
    {
      id: "chat",
      title: t("prototype.pages.chat.title"),
      description: t("prototype.pages.chat.desc"),
      features: t("prototype.pages.chat.features"),
      icon: "fas fa-comments",
      color: "bg-blue-600",
      colorLight: "bg-blue-600/20 text-blue-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="bg-[#2d2d2d] border-b border-[#404040] p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#6366f1] rounded-xl flex items-center justify-center">
              <i className="fas fa-paper-plane text-white text-lg transform -rotate-45"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {t("prototype.title")}
              </h1>
              <p className="text-sm text-gray-400">{t("prototype.subtitle")}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{t("prototype.livePreview")}</span>
            </div>
            <LanguageToggle />
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#404040]/50 transition-colors">
              <i className="fas fa-moon"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation */}
        <PrototypeNavigation />

        {/* Project Introduction */}
        <div className="bg-[#2d2d2d] rounded-2xl border border-[#404040] p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("prototype.projectTitle")}
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              {t("prototype.projectSubtitle")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#404040]">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-mobile-alt text-green-400 text-xl"></i>
                </div>
                <h3 className="font-medium text-white text-sm mb-2">
                  {t("prototype.features.mobile.title")}
                </h3>
                <p className="text-xs text-gray-400">
                  {t("prototype.features.mobile.desc")}
                </p>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#404040]">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-comments text-purple-400 text-xl"></i>
                </div>
                <h3 className="font-medium text-white text-sm mb-2">
                  {t("prototype.features.chat.title")}
                </h3>
                <p className="text-xs text-gray-400">
                  {t("prototype.features.chat.desc")}
                </p>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#404040]">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-palette text-blue-400 text-xl"></i>
                </div>
                <h3 className="font-medium text-white text-sm mb-2">
                  {t("prototype.features.dark.title")}
                </h3>
                <p className="text-xs text-gray-400">
                  {t("prototype.features.dark.desc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {prototypes.map((prototype) => (
            <div
              key={prototype.id}
              className="bg-[#2d2d2d] rounded-2xl border border-[#404040] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 ${prototype.color} rounded-lg flex items-center justify-center`}
                  >
                    <i className={`${prototype.icon} text-white text-sm`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {prototype.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {prototype.description}
                    </p>
                  </div>
                </div>
                <button
                  className="text-[#6366f1] hover:text-indigo-400 text-sm font-medium transition-colors"
                  onClick={() => openFullscreen(prototype.id)}
                >
                  <i className="fas fa-expand mr-1"></i>
                  {t("prototype.fullscreen")}
                </button>
              </div>

              <div className="aspect-[9/16] max-h-[400px] bg-[#1a1a1a] rounded-xl overflow-hidden border-2 border-[#404040] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <i
                    className={`${prototype.icon} text-4xl mb-4 ${prototype.colorLight.split(" ")[1]}`}
                  ></i>
                  <p className="text-sm">{prototype.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("prototype.livePreview")}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-400">
                <div className="flex items-center justify-between">
                  <span>{prototype.features}</span>
                  <span>{t("prototype.status")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional sections could go here */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#2d2d2d] rounded-xl border border-[#404040] p-4 text-center">
            <i className="fas fa-code text-[#6366f1] text-2xl mb-2"></i>
            <h4 className="font-medium text-white text-sm mb-1">
              {t("prototype.coreFeatures")}
            </h4>
            <p className="text-xs text-gray-400">React + TypeScript</p>
          </div>
          <div className="bg-[#2d2d2d] rounded-xl border border-[#404040] p-4 text-center">
            <i className="fas fa-paint-brush text-purple-400 text-2xl mb-2"></i>
            <h4 className="font-medium text-white text-sm mb-1">
              {t("prototype.designSystem")}
            </h4>
            <p className="text-xs text-gray-400">Tailwind CSS</p>
          </div>
          <div className="bg-[#2d2d2d] rounded-xl border border-[#404040] p-4 text-center">
            <i className="fas fa-server text-green-400 text-2xl mb-2"></i>
            <h4 className="font-medium text-white text-sm mb-1">
              {t("prototype.techArch")}
            </h4>
            <p className="text-xs text-gray-400">Next.js 15</p>
          </div>
          <div className="bg-[#2d2d2d] rounded-xl border border-[#404040] p-4 text-center">
            <i className="fas fa-mobile-alt text-blue-400 text-2xl mb-2"></i>
            <h4 className="font-medium text-white text-sm mb-1">
              {t("prototype.designFeatures")}
            </h4>
            <p className="text-xs text-gray-400">Mobile First</p>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenPrototype && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2d2d2d] rounded-2xl border border-[#404040] w-full max-w-sm h-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#404040]">
              <h3 className="font-medium text-white">
                {prototypes.find((p) => p.id === fullscreenPrototype)?.title}
              </h3>
              <button
                onClick={closeFullscreen}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 p-4">
              <div className="w-full h-full bg-[#1a1a1a] rounded-xl border border-[#404040] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <i className="fas fa-code text-4xl mb-4"></i>
                  <p className="text-sm">Prototype Preview</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {fullscreenPrototype}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
