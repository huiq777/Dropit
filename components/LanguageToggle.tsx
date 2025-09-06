"use client";

import { useI18n } from "@/lib/i18n";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({
  className = "",
}: LanguageToggleProps) {
  const { language, setLanguage } = useI18n();

  const handleToggle = () => {
    const newLanguage = language === "zh" ? "en" : "zh";
    setLanguage(newLanguage);
  };

  const displayText = language === "zh" ? "中" : "EN";
  
  return (
    <button
      onClick={handleToggle}
      className={`text-gray-400 hover:text-white transition-colors cursor-pointer ${className}`}
    >
      <span className="text-sm font-medium">{displayText}</span>
    </button>
  );
}
