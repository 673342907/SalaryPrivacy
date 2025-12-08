"use client";

import { FHEVMLoader } from "./confidential-salary/_components/FHEVMLoader";
import { DappWrapperWithProviders } from "~~/components/DappWrapperWithProviders";
import { ErrorBoundary } from "~~/components/ErrorBoundary";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { LocaleProvider } from "~~/contexts/LocaleContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <FHEVMLoader />
      <LocaleProvider>
        <ThemeProvider enableSystem>
          <DappWrapperWithProviders>{children}</DappWrapperWithProviders>
        </ThemeProvider>
      </LocaleProvider>
    </ErrorBoundary>
  );
}
