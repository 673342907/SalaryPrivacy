"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "~~/contexts/LocaleContext";

export function OptimizationsShowcase() {
  const { t } = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const optimizations = {
    examples: [
      {
        name: "FHEBlindAuction",
        description: t.optimizations.exampleDescriptions.blindAuction,
        category: "advanced",
        file: "packages/hardhat/contracts/examples/FHEBlindAuction.sol",
      },
      {
        name: "FHEVestingWallet",
        description: t.optimizations.exampleDescriptions.vestingWallet,
        category: "advanced",
        file: "packages/hardhat/contracts/examples/FHEVestingWallet.sol",
      },
      {
        name: "FHEArithmetic",
        description: t.optimizations.exampleDescriptions.arithmetic,
        category: "basic",
        file: "packages/hardhat/contracts/examples/FHEArithmetic.sol",
      },
      {
        name: "FHEComparison",
        description: t.optimizations.exampleDescriptions.comparison,
        category: "basic",
        file: "packages/hardhat/contracts/examples/FHEComparison.sol",
      },
      {
        name: "FHERangeQuery",
        description: t.optimizations.exampleDescriptions.rangeQuery,
        category: "utility",
        file: "packages/hardhat/contracts/examples/FHERangeQuery.sol",
      },
    ],
    tests: [
      {
        name: "performance.test.ts",
        description: t.optimizations.testDescriptions.performance,
        category: "testing",
        file: "packages/hardhat/test/performance.test.ts",
      },
      {
        name: "integration.test.ts",
        description: t.optimizations.testDescriptions.integration,
        category: "testing",
        file: "packages/hardhat/test/integration.test.ts",
      },
    ],
    tools: [
      {
        name: "create-fhevm-example",
        description: t.optimizations.toolDescriptions.scaffold,
        category: "tool",
        file: "packages/create-fhevm-example/",
        highlight: true,
      },
    ],
    cicd: [
      {
        name: "test.yml",
        description: t.optimizations.cicdDescriptions.test,
        category: "cicd",
        file: ".github/workflows/test.yml",
      },
      {
        name: "lint.yml",
        description: t.optimizations.cicdDescriptions.lint,
        category: "cicd",
        file: ".github/workflows/lint.yml",
      },
    ],
    docs: [
      {
        name: "ARCHITECTURE.md",
        description: t.optimizations.docDescriptions.architecture,
        category: "docs",
        file: "docs/ARCHITECTURE.md",
      },
      {
        name: "BEST_PRACTICES.md",
        description: t.optimizations.docDescriptions.bestPractices,
        category: "docs",
        file: "docs/BEST_PRACTICES.md",
      },
      {
        name: "CONTRIBUTING.md",
        description: t.optimizations.docDescriptions.contributing,
        category: "docs",
        file: "CONTRIBUTING.md",
      },
    ],
  };

  const categories = [
    { id: "all", label: t.optimizations.stats, icon: "📦" },
    { id: "examples", label: t.optimizations.examples, icon: "📝" },
    { id: "tests", label: t.optimizations.tests, icon: "🧪" },
    { id: "tools", label: t.optimizations.tools, icon: "🛠️" },
    { id: "cicd", label: t.optimizations.cicd, icon: "⚙️" },
    { id: "docs", label: t.optimizations.docs, icon: "📚" },
  ];

  const allItems = [
    ...optimizations.examples.map((item) => ({ ...item, type: "examples" })),
    ...optimizations.tests.map((item) => ({ ...item, type: "tests" })),
    ...optimizations.tools.map((item) => ({ ...item, type: "tools" })),
    ...optimizations.cicd.map((item) => ({ ...item, type: "cicd" })),
    ...optimizations.docs.map((item) => ({ ...item, type: "docs" })),
  ];

  const filteredItems =
    activeCategory === "all"
      ? allItems
      : allItems.filter((item) => item.type === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-2">🎯 {t.optimizations.title}</h2>
        <p className="text-gray-300">
          {t.optimizations.description}
        </p>
          <div className="mt-4 flex flex-wrap gap-2">
          <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
            ✅ {t.locale === "en" ? "9 Example Contracts" : "9个示例合约"}
          </div>
          <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
            ✅ {t.locale === "en" ? "5 Test Files" : "5个测试文件"}
          </div>
          <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
            ✅ {t.locale === "en" ? "Scaffolding Tool" : "脚手架工具"}
          </div>
          <div className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
            ✅ {t.locale === "en" ? "CI/CD Automation" : "CI/CD 自动化"}
          </div>
          <div className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm">
            ✅ {t.locale === "en" ? "Complete Documentation" : "完善文档"}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }
            `}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Optimizations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className={`
              bg-white/5 backdrop-blur-md rounded-xl p-5 border
              ${
                item.highlight
                  ? "border-yellow-500/50 bg-yellow-500/10"
                  : "border-white/10 hover:border-white/20"
              }
              transition-all hover:shadow-lg
            `}
          >
            {item.highlight && (
              <div className="mb-2">
                <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                  ⭐ {t.optimizations.zamaBounty}
                </span>
              </div>
            )}
            <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-3">{item.description}</p>
            <div className="flex items-center justify-between mb-3">
              <code className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">
                {item.file}
              </code>
              <span className="text-xs text-gray-500 capitalize">{item.category}</span>
            </div>
            {item.type === "examples" && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-blue-300 mb-2 font-semibold">
                  {t.locale === "en" ? "💡 How to use:" : "💡 使用方法："}
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>1. {t.locale === "en" ? "View the contract code in" : "查看合约代码："} <code className="text-gray-500">{item.file}</code></p>
                  <p>2. {t.locale === "en" ? "Compile contracts:" : "编译合约："} <code className="text-gray-500">pnpm hardhat:compile</code></p>
                  <p>3. {t.locale === "en" ? "Deploy to localhost (from project root):" : "部署到本地（在项目根目录）："} <code className="text-gray-500">pnpm deploy:localhost</code></p>
                  <p>4. {t.locale === "en" ? "Or deploy from hardhat package:" : "或在 hardhat 目录下："} <code className="text-gray-500">pnpm deploy:localhost</code></p>
                  <p>5. {t.locale === "en" ? "Use FHEVM SDK to encrypt values and interact with the contract" : "使用 FHEVM SDK 加密数值并与合约交互"}</p>
                  <p>6. {t.locale === "en" ? "See GitHub repository for complete examples" : "查看 GitHub 仓库获取完整示例"}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">📊 {t.optimizations.stats}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">9</div>
            <div className="text-sm text-gray-400">{t.locale === "en" ? "Example Contracts" : "示例合约"}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">5</div>
            <div className="text-sm text-gray-400">{t.locale === "en" ? "Test Files" : "测试文件"}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">1</div>
            <div className="text-sm text-gray-400">{t.locale === "en" ? "Scaffolding Tool" : "脚手架工具"}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">2</div>
            <div className="text-sm text-gray-400">{t.locale === "en" ? "CI/CD Workflows" : "CI/CD 工作流"}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400">5</div>
            <div className="text-sm text-gray-400">{t.locale === "en" ? "Documentation" : "文档文件"}</div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">🔗 {t.locale === "en" ? "Related Links" : "相关链接"}</h3>
        <div className="space-y-2">
          <Link
            href="https://github.com/673342907/SalaryPrivacy"
            target="_blank"
            className="block text-blue-400 hover:text-blue-300 transition-colors"
          >
            📦 {t.locale === "en" ? "GitHub Repository - View all source code" : "GitHub 仓库 - 查看所有源代码"}
          </Link>
          <div className="text-gray-400 text-sm">
            💡 {t.locale === "en" ? "Tip: View all optimization files on GitHub" : "提示：在 GitHub 上可以查看所有优化文件的完整代码"}
          </div>
        </div>
      </div>
    </div>
  );
}

