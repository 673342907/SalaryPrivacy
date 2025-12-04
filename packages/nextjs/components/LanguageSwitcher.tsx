"use client";

import { useLocale } from "~~/contexts/LocaleContext";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLocale("en")}
        className={`
          px-3 py-1.5 text-sm font-medium rounded-lg transition-all
          ${
            locale === "en"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }
        `}
      >
        English
      </button>
      <button
        onClick={() => setLocale("zh")}
        className={`
          px-3 py-1.5 text-sm font-medium rounded-lg transition-all
          ${
            locale === "zh"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }
        `}
      >
        中文
      </button>
    </div>
  );
}

