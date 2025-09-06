"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { ArrowBigDownDash, Loader2, LogIn, AlertCircle } from "lucide-react";

interface AuthFormData {
  password: string;
}

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: data.password }),
      });

      const result = await response.json();

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(result.error || t("auth.loginFailed"));
      }
    } catch (err) {
      setError(t("auth.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col max-w-sm mx-auto">
      {/* Status bar placeholder */}
      <div className="h-12"></div>

      {/* Header */}
      <div className="p-4 text-center">
        <div className="w-16 h-16 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ArrowBigDownDash className="text-white w-8 h-8" />
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">
          {t("auth.title")}
        </h1>
        <p className="text-gray-400 text-sm">{t("auth.subtitle")}</p>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4">
        {/* Login form */}
        <div className="bg-[#2d2d2d] rounded-2xl p-6 border border-[#404040] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">
              {t("auth.loginAccount")}
            </h2>
            <LanguageToggle />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("password", {
                  required: t("auth.passwordRequired"),
                  minLength: { value: 1, message: t("auth.passwordRequired") },
                })}
                type="password"
                id="password"
                className="w-full bg-[#1a1a1a] border border-[#404040] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-colors"
                placeholder={t("auth.passwordPlaceholder")}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6366f1] hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t("auth.verifying")}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  {t("auth.enterDropit")}
                </>
              )}
            </button>
          </form>

          {/* Error message */}
          {error && (
            <div className="mt-3 p-3 bg-red-900/30 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">© 2025 Dropit</p>
      </div>
    </div>
  );
}
