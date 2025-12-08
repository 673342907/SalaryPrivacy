"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * 自定义 Hook：处理快速导航逻辑
 * 统一处理页面内导航和跨页面导航
 */
export function useQuickNavigation() {
  const router = useRouter();

  const navigateToTab = useCallback(
    (tab: string) => {
      if (typeof window === "undefined") return;

      // 如果不在 confidential-salary 页面，先导航到该页面
      if (!window.location.pathname.includes("/confidential-salary")) {
        router.push(`/confidential-salary#${tab}`);
        return;
      }

      // 已经在页面上了，直接更新 hash
      const currentHash = window.location.hash.slice(1);
      if (currentHash !== tab) {
        // 更新 URL hash
        window.history.pushState(null, "", `#${tab}`);

        // 手动触发 hashchange 事件
        const hashChangeEvent = new HashChangeEvent("hashchange", {
          oldURL: window.location.href.replace(`#${currentHash}`, `#${tab}`),
          newURL: window.location.href,
        });
        window.dispatchEvent(hashChangeEvent);
      }

      // 滚动到对应位置
      setTimeout(() => {
        const element = document.getElementById(tab);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    },
    [router],
  );

  return { navigateToTab };
}
