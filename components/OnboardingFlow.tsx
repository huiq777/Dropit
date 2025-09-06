"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [showPrototypes, setShowPrototypes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setShowPrototypes(true);
    }
  };

  const handleBackToAuth = () => {
    setShowPrototypes(false);
    setPassword("");
  };

  const openPrototype = (prototypeId: string) => {
    console.log("Opening prototype:", prototypeId);
    if (onComplete) {
      onComplete();
    }
  };

  const prototypes = [
    {
      id: "login",
      title: t("prototype.pages.login.title"),
      description: t("prototype.pages.login.desc"),
      icon: "fas fa-sign-in-alt",
      color: "bg-green-600",
    },
    {
      id: "chat",
      title: t("prototype.pages.chat.title"),
      description: t("prototype.pages.chat.desc"),
      icon: "fas fa-comments",
      color: "bg-blue-600",
    },
  ];

  if (showPrototypes) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        {/* Header */}
        <div className="bg-[#2d2d2d] border-b border-[#404040] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center">
              <i className="fas fa-paper-plane text-white text-sm transform -rotate-45"></i>
            </div>
            <h1 className="text-lg font-semibold text-white">
              {t("onboarding.prototypeTitle")}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageToggle className="text-sm" />
            <button
              onClick={handleBackToAuth}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Prototype List */}
        <div className="p-4 max-w-sm mx-auto">
          <div className="space-y-3">
            {prototypes.map((prototype) => (
              <div
                key={prototype.id}
                className="bg-[#2d2d2d] rounded-xl p-4 border border-[#404040] hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => openPrototype(prototype.id)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${prototype.color} rounded-lg flex items-center justify-center`}
                  >
                    <i className={`${prototype.icon} text-white`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">
                      {prototype.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {prototype.description}
                    </p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-500"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center p-4 relative">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle className="text-sm" />
      </div>

      <div className="w-full max-w-sm">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-paper-plane text-white text-2xl transform -rotate-45"></i>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            {t("onboarding.title")}
          </h1>
          <p className="text-gray-400 text-sm">{t("onboarding.subtitle")}</p>
        </div>

        {/* Auth Form */}
        <div className="bg-[#2d2d2d] rounded-2xl p-6 border border-[#404040]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#404040] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-colors"
                placeholder={t("onboarding.passwordPlaceholder")}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6366f1] hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              {t("onboarding.enterDemo")}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">{t("onboarding.hint")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
