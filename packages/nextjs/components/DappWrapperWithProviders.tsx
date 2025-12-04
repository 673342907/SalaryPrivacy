"use client";

import { useEffect, useState } from "react";
import { InMemoryStorageProvider } from "@fhevm-sdk";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/helper";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const DappWrapperWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 抑制 Talisman 扩展错误
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args: any[]) => {
      const errorMessage = args[0]?.toString() || "";
      if (errorMessage.includes("Talisman extension has not been configured") ||
          errorMessage.includes("Talisman") && errorMessage.includes("onboarding")) {
        // 忽略 Talisman 错误
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const warnMessage = args[0]?.toString() || "";
      if (warnMessage.includes("Talisman extension has not been configured") ||
          warnMessage.includes("Talisman") && warnMessage.includes("onboarding")) {
        // 忽略 Talisman 警告
        return;
      }
      originalWarn.apply(console, args);
    };

    // 全局错误处理，忽略 Talisman 相关错误
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes("Talisman extension has not been configured") ||
          (event.message?.includes("Talisman") && event.message?.includes("onboarding"))) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    // 处理未捕获的 Promise 拒绝
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || event.reason?.toString() || "";
      if (errorMessage.includes("Talisman extension has not been configured") ||
          (errorMessage.includes("Talisman") && errorMessage.includes("onboarding"))) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          <ProgressBar height="3px" color="#2299dd" />
          <div className={`flex flex-col min-h-screen`}>
            <Header />
            <main className="relative flex flex-col flex-1">
              <InMemoryStorageProvider>{children}</InMemoryStorageProvider>
            </main>
          </div>
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
