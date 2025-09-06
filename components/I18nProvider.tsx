"use client";

import React, { useState, useEffect, useMemo, ReactNode } from "react";
import {
  I18nContext,
  Language,
  getDefaultLanguage,
  saveLanguage,
  createTranslationFunction,
  getNestedTranslation,
} from "@/lib/i18n";

// 导入语言文件
import enTranslations from "@/locales/en.json";
import zhTranslations from "@/locales/zh.json";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // Initialize language immediately on client side
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("dropit-language");
        if (stored === "zh" || stored === "en") {
          return stored as Language;
        }
        const browserLang = navigator.language.toLowerCase();
        return browserLang.startsWith("zh") ? "zh" : "en";
      } catch {
        return "en";
      }
    }
    return "en";
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化语言设置
  useEffect(() => {
    // Set loaded immediately since language is initialized above
    setIsLoaded(true);
  }, []);

  // 切换语言的处理函数
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    saveLanguage(newLanguage);
  };

  // 创建翻译函数
  const t = useMemo(() => {
    const currentTranslations =
      language === "zh" ? zhTranslations : enTranslations;
    const fallbackTranslations =
      language === "zh" ? enTranslations : zhTranslations;

    return (key: string, fallback?: string) => {
      // 支持嵌套键路径，如 'auth.title'
      const current = getNestedTranslation(currentTranslations, key);
      if (current) return current;

      const fallbackValue = getNestedTranslation(fallbackTranslations, key);
      if (fallbackValue) return fallbackValue;

      return fallback || key;
    };
  }, [language]);

  // Context值
  const contextValue = useMemo(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      t,
    }),
    [language, t],
  );

  // Skip loading screen - render children immediately
  // if (!isLoaded) {
  //   return (
  //     <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
  //       <div className="flex items-center space-x-2 text-white">
  //         <div className="w-4 h-4 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
  //         <span className="text-sm">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}
