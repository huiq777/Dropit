"use client";

import { useRouter } from "next/navigation";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { I18nProvider } from "@/components/I18nProvider";

export default function OnboardingPage() {
  const router = useRouter();

  const handleOnboardingComplete = () => {
    // Navigate to prototype overview or main app
    router.push("/prototype");
  };

  return (
    <I18nProvider>
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    </I18nProvider>
  );
}
