import { createContext, useContext, useCallback } from "react";

// 支持的语言类型
export type Language = "en" | "zh";

// 语言上下文类型
export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

// 创建上下文
export const I18nContext = createContext<I18nContextType | null>(null);

// 自定义Hook
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// 语言存储键
const LANGUAGE_STORAGE_KEY = "dropit-language";

// 获取默认语言
export function getDefaultLanguage(): Language {
  if (typeof window === "undefined") return "en";

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (stored === "en" || stored === "zh")) {
      return stored as Language;
    }
  } catch (error) {
    console.warn("Failed to read language from localStorage:", error);
  }

  // 检测浏览器语言
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith("zh") ? "zh" : "en";
}

// 保存语言设置
export function saveLanguage(language: Language): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn("Failed to save language to localStorage:", error);
  }
}

// 翻译函数类型
export type TranslationFunction = (key: string, fallback?: string) => string;

// 创建翻译函数
export function createTranslationFunction(
  translations: Record<string, string>,
  fallbackTranslations: Record<string, string>,
): TranslationFunction {
  return (key: string, fallback?: string) => {
    // 尝试从当前语言翻译中获取
    if (translations[key]) {
      return translations[key];
    }

    // 尝试从fallback翻译中获取
    if (fallbackTranslations[key]) {
      return fallbackTranslations[key];
    }

    // 返回提供的fallback或key本身
    return fallback || key;
  };
}

// 嵌套对象键路径访问
export function getNestedTranslation(
  obj: any,
  path: string,
): string | undefined {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}
