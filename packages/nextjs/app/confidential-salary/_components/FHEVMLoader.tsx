"use client";

import { useEffect, useState } from "react";

/**
 * 组件：预加载 FHEVM Relayer SDK
 * 在 FHEVM 初始化之前提前加载 SDK，避免初始化时的加载延迟
 * 支持自动重试和更好的错误处理
 */
export function FHEVMLoader() {
  const [loadStatus, setLoadStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const checkRelayerSDK = (): boolean => {
    if (typeof window === "undefined") return false;
    const win = window as any;
    return !!(win.relayerSDK && typeof win.relayerSDK.initSDK === "function");
  };

  const loadRelayerSDK = (retry: number = 0): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if (checkRelayerSDK()) {
        setLoadStatus("loaded");
        console.log("[FHEVMLoader] Relayer SDK already loaded");
        resolve();
        return;
      }

      // 尝试从 CDN 加载（使用 Zama 官方 CDN）
      const SDK_CDN_URL = "https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs";

      // 检查是否已经存在脚本
      const existingScript = document.querySelector(`script[src="${SDK_CDN_URL}"]`);
      if (existingScript) {
        // 等待脚本执行
        const checkInterval = setInterval(() => {
          if (checkRelayerSDK()) {
            clearInterval(checkInterval);
            setLoadStatus("loaded");
            console.log("[FHEVMLoader] Relayer SDK loaded from existing script");
            resolve();
          }
        }, 200);

        // 超时检查（10秒，给 Sepolia Relayer 更多时间）
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!checkRelayerSDK()) {
            if (retry < maxRetries) {
              console.log(`[FHEVMLoader] Retrying... (${retry + 1}/${maxRetries})`);
              loadRelayerSDK(retry + 1).then(resolve).catch(reject);
            } else {
              setLoadStatus("error");
              reject(new Error("Relayer SDK failed to load after multiple retries"));
            }
          }
        }, 10000);
        return;
      }

      // 创建并加载脚本
      const script = document.createElement("script");
      script.src = SDK_CDN_URL;
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => {
        // 等待脚本执行并检查
        const checkInterval = setInterval(() => {
          if (checkRelayerSDK()) {
            clearInterval(checkInterval);
            setLoadStatus("loaded");
            console.log("[FHEVMLoader] Relayer SDK loaded successfully");
            resolve();
          }
        }, 200);

        // 超时检查（5秒）
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!checkRelayerSDK()) {
            if (retry < maxRetries) {
              console.log(`[FHEVMLoader] Retrying... (${retry + 1}/${maxRetries})`);
              // 移除失败的脚本
              script.remove();
              loadRelayerSDK(retry + 1).then(resolve).catch(reject);
            } else {
              setLoadStatus("error");
              reject(new Error("Relayer SDK object not found after script load"));
            }
          }
        }, 5000);
      };

      script.onerror = () => {
        console.error(`[FHEVMLoader] Failed to load Relayer SDK from ${SDK_CDN_URL}`);
        if (retry < maxRetries) {
          console.log(`[FHEVMLoader] Retrying... (${retry + 1}/${maxRetries})`);
          setTimeout(() => {
            loadRelayerSDK(retry + 1).then(resolve).catch(reject);
          }, 2000);
        } else {
          setLoadStatus("error");
          reject(new Error(`Failed to load Relayer SDK from ${SDK_CDN_URL} after ${maxRetries} retries`));
        }
      };

      console.log(`[FHEVMLoader] Loading Relayer SDK from ${SDK_CDN_URL} (attempt ${retry + 1})`);
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    loadRelayerSDK(0).catch((error) => {
      console.error("[FHEVMLoader] Error:", error);
      setLoadStatus("error");
    });
  }, []);

  // 定期检查 SDK 状态（用于恢复）
  useEffect(() => {
    if (loadStatus === "error") {
      const interval = setInterval(() => {
        if (checkRelayerSDK()) {
          setLoadStatus("loaded");
          console.log("[FHEVMLoader] Relayer SDK detected after error recovery");
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loadStatus]);

  // 这个组件不渲染任何内容，只是预加载 SDK
  return null;
}

