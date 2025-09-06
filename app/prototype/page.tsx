"use client";

import { PrototypeOverview } from "@/components/PrototypeOverview";
import { I18nProvider } from "@/components/I18nProvider";

export default function PrototypePage() {
  const handlePrototypeSelect = (prototypeId: string) => {
    console.log("Selected prototype:", prototypeId);
    // Handle prototype selection - could navigate to specific prototype or open modal
  };

  return (
    <I18nProvider>
      <PrototypeOverview onPrototypeSelect={handlePrototypeSelect} />
    </I18nProvider>
  );
}
