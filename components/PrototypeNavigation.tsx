"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export function PrototypeNavigation() {
  const { t } = useI18n();
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: t("chat.title"),
      icon: "fas fa-home",
      description: "Main application",
    },
    {
      href: "/onboarding",
      label: t("onboarding.title"),
      icon: "fas fa-door-open",
      description: "Onboarding flow",
    },
    {
      href: "/prototype",
      label: t("prototype.title"),
      icon: "fas fa-desktop",
      description: "Prototype overview",
    },
  ];

  return (
    <div className="bg-[#2d2d2d] border border-[#404040] rounded-xl p-4 mb-6">
      <h3 className="text-sm font-medium text-white mb-3 flex items-center">
        <i className="fas fa-compass mr-2"></i>
        Navigation
      </h3>
      <div className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-[#6366f1]/20 text-[#6366f1]"
                : "text-gray-400 hover:text-white hover:bg-[#404040]/50"
            }`}
          >
            <i className={`${item.icon} text-sm w-4`}></i>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </div>
            {pathname === item.href && (
              <i className="fas fa-circle text-xs"></i>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
