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
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col w-full">
      <div className="max-w-lg md:max-w-xl mx-auto px-6 md:px-8 flex flex-col min-h-screen">
        {/* Status bar placeholder */}
        <div className="h-8 md:h-12"></div>

        {/* Header */}
        <div className="p-4 md:p-6 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
            <ArrowBigDownDash className="text-white w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-3 md:mb-4">
            {t("auth.title")}
          </h1>
          <p className="text-gray-400 text-base md:text-lg">{t("auth.subtitle")}</p>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Login form */}
          <div className="bg-[#2d2d2d] rounded-2xl p-6 md:p-8 border border-[#404040] mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-medium text-white">
              {t("auth.loginAccount")}
            </h2>
            <LanguageToggle size="large" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            <div>
              <input
                {...register("password", {
                  required: t("auth.passwordRequired"),
                  minLength: { value: 1, message: t("auth.passwordRequired") },
                })}
                type="password"
                id="password"
                className="w-full bg-[#1a1a1a] border border-[#404040] rounded-xl px-4 py-3 md:px-6 md:py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-colors text-base md:text-lg"
                placeholder={t("auth.passwordPlaceholder")}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-2 text-sm md:text-base text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6366f1] hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 md:py-4 md:px-8 rounded-xl transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed text-base md:text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin mr-2 md:mr-3" />
                  {t("auth.verifying")}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                  {t("auth.enterDropit")}
                </>
              )}
            </button>
          </form>

          {/* Error message */}
          {error && (
            <div className="mt-3 p-3 md:p-4 bg-red-900/30 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm md:text-base flex items-center">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                {error}
              </p>
            </div>
          )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 text-center">
          <p className="text-sm md:text-base text-gray-600">© 2025 Dropit</p>
        </div>
      </div>
    </div>
  );
}
