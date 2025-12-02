"use client";

import { useEffect, useState } from "react";

/**
 * 组件：预加载 FHEVM Relayer SDK
 * 在 FHEVM 初始化之前提前加载 SDK，避免初始化时的加载延迟
 */
export function FHEVMLoader() {
  const [loadStatus, setLoadStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检查是否已经加载
    if (typeof window !== "undefined" && "relayerSDK" in window) {
      const win = window as any;
      if (win.relayerSDK && typeof win.relayerSDK.initSDK === "function") {
        setLoadStatus("loaded");
        return;
      }
    }

    // 尝试从 CDN 加载（使用 Zama 官方 CDN）
    const SDK_CDN_URL = "https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs";

    // 检查是否已经存在脚本
    const existingScript = document.querySelector(`script[src="${SDK_CDN_URL}"]`);
    if (existingScript) {
      // 等待一下让脚本执行
      setTimeout(() => {
        if (typeof window !== "undefined" && "relayerSDK" in window) {
          setLoadStatus("loaded");
        } else {
          setLoadStatus("error");
          setError("脚本已加载但 window.relayerSDK 不存在");
        }
      }, 1000);
      return;
    }

    // 创建并加载脚本
    const script = document.createElement("script");
    script.src = SDK_CDN_URL;
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      // 等待一下让脚本执行
      setTimeout(() => {
        if (typeof window !== "undefined" && "relayerSDK" in window) {
          const win = window as any;
          if (win.relayerSDK && typeof win.relayerSDK.initSDK === "function") {
            setLoadStatus("loaded");
            console.log("[FHEVMLoader] Relayer SDK loaded successfully");
          } else {
            setLoadStatus("error");
            setError("window.relayerSDK 对象无效");
          }
        } else {
          setLoadStatus("error");
          setError("window.relayerSDK 不存在");
        }
      }, 500);
    };

    script.onerror = () => {
      setLoadStatus("error");
      setError(`无法从 ${SDK_CDN_URL} 加载 Relayer SDK`);
      console.error("[FHEVMLoader] Failed to load Relayer SDK");
    };

    document.head.appendChild(script);

    return () => {
      // 清理：移除脚本（如果需要）
      // 注意：通常不需要移除，因为 SDK 需要一直存在
    };
  }, []);

  // 这个组件不渲染任何内容，只是预加载 SDK
  return null;
}

