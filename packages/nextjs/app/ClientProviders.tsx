"use client";

import { DappWrapperWithProviders } from "~~/components/DappWrapperWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { LocaleProvider } from "~~/contexts/LocaleContext";
import { ErrorBoundary } from "~~/components/ErrorBoundary";
import { FHEVMLoader } from "./confidential-salary/_components/FHEVMLoader";

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



