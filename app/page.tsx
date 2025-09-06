"use client";

import { useState, useEffect } from "react";
import { AuthForm } from "@/components/AuthForm";
import { MainChatInterface } from "@/components/MainChatInterface";
import { I18nProvider } from "@/components/I18nProvider";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="));

      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    // Use a small timeout to ensure DOM is ready
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <I18nProvider>
      {isLoading ? (
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
          <div className="text-white flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#6366f1] rounded-full animate-pulse"></div>
            <span>Loading...</span>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <AuthForm onSuccess={handleAuthSuccess} />
      ) : (
        <MainChatInterface />
      )}
    </I18nProvider>
  );
}
