"use client";

import { useCallback, useMemo, useState } from "react";
import { useData } from "../_context/DataContext";
import { useFHEDecrypt } from "@fhevm-sdk";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useLocale } from "~~/contexts/LocaleContext";
import { useConfidentialSalary } from "~~/hooks/confidential-salary/useConfidentialSalary";
import { useFormValidation } from "~~/hooks/confidential-salary/useFormValidation";
import { notification } from "~~/utils/helper/notification";

export function SalaryManagement() {
  const { t } = useLocale();
  const { address } = useAccount();
  const { salaries, addSalary } = useData();
  const { validateAddress, validateAmount } = useFormValidation();
  const {
    submitSalary,
    getEncryptedSalary,
    hasContract,
    isPending,
    fhevmStatus,
    contractAddress,
    fhevmInstance,
    ethersSigner,
    fhevmDecryptionSignatureStorage,
    chainId,
  } = useConfidentialSalary();
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeAddress: "",
    amount: "",
  });
  const [viewAddress, setViewAddress] = useState("");
  const [encryptedSalaryHandle, setEncryptedSalaryHandle] = useState<string | null>(null);
  const [useBlockchain, setUseBlockchain] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 准备解密请求
  const decryptRequests = useMemo(() => {
    if (!encryptedSalaryHandle || !contractAddress || encryptedSalaryHandle === ethers.ZeroHash) {
      return undefined;
    }
    return [{ handle: encryptedSalaryHandle, contractAddress } as const];
  }, [encryptedSalaryHandle, contractAddress]);

  // 使用 FHE 解密 Hook
  const {
    canDecrypt,
    decrypt,
    isDecrypting: isDecryptingFromHook,
    results: decryptResults,
  } = useFHEDecrypt({
    instance: fhevmInstance,
    ethersSigner: ethersSigner as any,
    fhevmDecryptionSignatureStorage,
    chainId,
    requests: decryptRequests,
  });

  const handleSubmitSalary = useCallback(async () => {
    // 使用统一的验证逻辑
    const addressValidation = validateAddress(formData.employeeAddress);
    if (!addressValidation.isValid) {
      setErrorMessage(addressValidation.error || "");
      return;
    }

    const amountValidation = validateAmount(formData.amount, "amount");
    if (!amountValidation.isValid) {
      setErrorMessage(amountValidation.error || "");
      return;
    }

    setErrorMessage("");

    // 如果使用区块链且合约已部署
    if (useBlockchain && hasContract && address) {
      try {
        setIsEncrypting(true);
        await submitSalary(formData.employeeAddress, parseFloat(formData.amount));
        setFormData({ employeeAddress: "", amount: "" });
        setShowSubmitForm(false);
        setShowSuccess(true);
        setIsEncrypting(false);
        notification.success(
          <div className="space-y-1">
            <div className="font-bold">✅ {t.salary.success}</div>
            <div className="text-sm">{t.salary.successMessage}</div>
          </div>,
          { duration: 4000 },
        );
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error: any) {
        setIsEncrypting(false);
        setErrorMessage(error.message || t.salary.errors.submitFailed);
      }
    } else {
      // 使用本地数据（演示模式）
      setIsEncrypting(true);
      const loadingId = notification.loading(t.salary.encrypting, { duration: Infinity });

      // 模拟加密过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEncrypting(false);
      notification.remove(loadingId);

      const newSalary = {
        id: salaries.length > 0 ? Math.max(...salaries.map(s => s.id)) + 1 : 1,
        employeeAddress: formData.employeeAddress,
        employeeName: t.locale === "en" ? `Employee ${salaries.length + 1}` : `员工 ${salaries.length + 1}`,
        amount: formData.amount,
        encrypted: true,
        submittedAt: new Date().toLocaleString("zh-CN"),
      };
      addSalary(newSalary);
      setFormData({ employeeAddress: "", amount: "" });
      setShowSubmitForm(false);
      setShowSuccess(true);
      notification.success(
        <div className="space-y-1">
          <div className="font-bold">✅ {t.salary.success}</div>
          <div className="text-sm">{t.salary.successMessage}</div>
        </div>,
        { duration: 4000 },
      );
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [
    formData.employeeAddress,
    formData.amount,
    useBlockchain,
    hasContract,
    address,
    submitSalary,
    addSalary,
    salaries,
    validateAddress,
    validateAmount,
    t.salary,
    t.locale,
  ]);

  const handleViewSalary = async () => {
    if (!viewAddress) {
      notification.warning(t.locale === "en" ? "Please enter employee address" : "请输入员工地址", { duration: 3000 });
      return;
    }
    if (!viewAddress.startsWith("0x") || viewAddress.length !== 42) {
      notification.error(t.salary.errors.addressInvalid, { duration: 4000 });
      return;
    }

    // 如果使用区块链且合约已部署
    if (useBlockchain && hasContract && address) {
      try {
        setIsDecrypting(true);
        const loadingId = notification.loading(
          t.locale === "en" ? "Retrieving encrypted salary..." : "正在获取加密薪资...",
          { duration: Infinity },
        );

        // 获取加密薪资
        const encryptedHandle = await getEncryptedSalary(viewAddress);
        notification.remove(loadingId);

        if (!encryptedHandle) {
          setIsDecrypting(false);
          notification.warning(t.salary.notFound, { duration: 3000 });
          return;
        }

        // 设置要解密的 handle
        setEncryptedSalaryHandle(encryptedHandle);

        // 触发解密
        if (canDecrypt && decrypt) {
          await decrypt();
        }

        setIsDecrypting(false);
      } catch (error: any) {
        setIsDecrypting(false);
        notification.error(`${t.locale === "en" ? "Failed to view salary" : "查看薪资失败"}: ${error.message}`, {
          duration: 5000,
        });
      }
    } else {
      // 使用本地数据（演示模式）
      setIsDecrypting(true);
      const loadingId = notification.loading(t.salary.decrypting, { duration: Infinity });
      // 模拟解密过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsDecrypting(false);
      notification.remove(loadingId);

      const salary = salaries.find(s => s.employeeAddress.toLowerCase() === viewAddress.toLowerCase());
      if (salary) {
        notification.success(
          <div className="space-y-1">
            <div className="font-bold">✅ {t.salary.decryptSuccess}</div>
            <div className="text-sm">
              {t.locale === "en" ? "Employee" : "员工"}：{salary.employeeName}
            </div>
            <div className="text-sm">
              {t.locale === "en" ? "Salary" : "薪资"}：{salary.amount} ETH
            </div>
          </div>,
          { duration: 4000 },
        );
      } else {
        notification.warning(t.salary.notFound, { duration: 3000 });
      }
    }

    setShowViewForm(false);
  };

  // 显示解密结果
  if (encryptedSalaryHandle && decryptResults[encryptedSalaryHandle] !== undefined) {
    const decryptedValue = decryptResults[encryptedSalaryHandle];
    if (typeof decryptedValue !== "undefined") {
      notification.success(
        <div className="space-y-1">
          <div className="font-bold">✅ {t.salary.decryptSuccess}</div>
          <div className="text-sm">
            {t.salary.decryptSuccessMessage
              .replace("{address}", `${viewAddress.slice(0, 10)}...${viewAddress.slice(-8)}`)
              .replace("{amount}", Number(decryptedValue).toString())}
          </div>
        </div>,
        { duration: 5000 },
      );
      setEncryptedSalaryHandle(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-900">{t.salary.success}</p>
              <p className="text-sm text-green-700">{t.salary.successMessage}</p>
            </div>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-800">
            ✕
          </button>
        </div>
      )}

      {/* Real-World Use Case */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💼</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t.locale === "en" ? "Real-World Use Case" : "真实应用场景"}
            </h3>
            <p className="text-gray-700 mb-3">
              <strong>{t.locale === "en" ? "Problem:" : "问题："}</strong>{" "}
              {t.locale === "en"
                ? "Traditional salary management systems have serious privacy leakage risks. Even with encrypted storage, all data needs to be decrypted for statistical analysis, leading to privacy exposure."
                : "传统薪资管理系统存在严重的隐私泄露风险。即使使用加密存储，在进行统计分析时也需要解密所有数据，导致隐私暴露。"}
            </p>
            <p className="text-gray-700 mb-3">
              <strong>{t.locale === "en" ? "Solution:" : "解决方案："}</strong>{" "}
              {t.locale === "en"
                ? "Using FHE technology, salary data is fully encrypted and stored, allowing statistical calculations without decryption, protecting privacy while supporting data analysis."
                : "使用 FHE 技术，薪资数据全程加密存储，在不解密的情况下进行统计计算，既保护了隐私，又支持数据分析。"}
            </p>
            <div className="bg-white rounded-lg p-3 mt-3">
              <p className="text-sm text-gray-700">
                <strong>✅ {t.locale === "en" ? "Actual Value:" : "实际价值："}</strong>{" "}
                {t.locale === "en"
                  ? "Enterprises can securely manage salary data, perform budget analysis and compliance checks, while fully protecting employee privacy, complying with data protection regulations like GDPR, CCPA."
                  : "企业可以安全地管理薪资数据，进行预算分析和合规检查，同时完全保护员工隐私，符合 GDPR、CCPA 等数据保护法规。"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Feature Description */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <span className="text-3xl mr-3">💰</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.salary.title}</h2>
            <p className="text-gray-700 mb-2">
              <strong>{t.locale === "en" ? "Core Function:" : "核心功能："}</strong> {t.salary.subtitle}
            </p>
            <div className="bg-white rounded-lg p-3 mt-2">
              <p className="text-sm text-gray-700">
                <strong>🔐 {t.locale === "en" ? "FHE Encryption Process:" : "FHE 加密流程："}</strong>
              </p>
              <ol className="text-sm text-gray-600 mt-1 ml-4 list-decimal">
                <li>{t.locale === "en" ? "Enter employee address and salary amount" : "输入员工地址和薪资金额"}</li>
                <li>{t.locale === "en" ? "System encrypts salary using FHEVM" : "系统使用 FHEVM 对薪资进行加密"}</li>
                <li>{t.locale === "en" ? "Encrypted data is stored on blockchain" : "加密后的数据存储在区块链上"}</li>
                <li>
                  {t.locale === "en" ? "Only authorized users can decrypt and view" : "只有有权限的用户可以解密查看"}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Mode Toggle */}
      {hasContract && address && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">🔗 {t.salary.blockchainMode}</h4>
              <p className="text-sm text-yellow-800">{useBlockchain ? t.salary.blockchainTip : t.salary.demoMode}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useBlockchain}
                onChange={e => setUseBlockchain(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>
          {useBlockchain && fhevmStatus !== "ready" && (
            <div className="mt-2 text-sm text-yellow-700">
              ⚠️{" "}
              {t.locale === "en"
                ? `FHEVM Status: ${fhevmStatus}, please wait for initialization`
                : `FHEVM 状态: ${fhevmStatus}，请等待初始化完成`}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{t.locale === "en" ? "Salary Records" : "薪资记录"}</h3>
          <p className="text-sm text-gray-200">
            {t.locale === "en"
              ? `Currently ${salaries.length} encrypted salary records`
              : `当前共有 ${salaries.length} 条加密薪资记录`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowViewForm(!showViewForm)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md flex items-center gap-2"
          >
            <span>🔍</span>
            {showViewForm ? t.common.cancel : t.salary.view}
          </button>
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md flex items-center gap-2"
          >
            <span>+</span>
            {showSubmitForm ? t.common.cancel : t.salary.submit}
          </button>
        </div>
      </div>

      {/* Submit Salary Form */}
      {showSubmitForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.locale === "en" ? "Submit Encrypted Salary" : "提交加密薪资"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.salary.employeeAddress} <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.employeeAddress}
                  onChange={e => setFormData({ ...formData, employeeAddress: e.target.value })}
                  placeholder="0x..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                />
                {address && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, employeeAddress: address })}
                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-xs font-medium whitespace-nowrap"
                  >
                    {t.locale === "en" ? "Use My Address" : "使用我的地址"}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡{" "}
                {address
                  ? t.locale === "en"
                    ? `Current wallet: ${address.slice(0, 10)}...${address.slice(-8)}`
                    : `当前钱包：${address.slice(0, 10)}...${address.slice(-8)}`
                  : t.locale === "en"
                    ? "Please connect wallet first"
                    : "请先连接钱包"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.salary.amount} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                placeholder={t.locale === "en" ? "e.g., 10000" : "例如：10000"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
              />
              <div className="mt-1 flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, amount: "10000" })}
                  className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  {t.locale === "en" ? "10k" : "1万"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, amount: "20000" })}
                  className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  {t.locale === "en" ? "20k" : "2万"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, amount: "30000" })}
                  className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  {t.locale === "en" ? "30k" : "3万"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, amount: "50000" })}
                  className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  {t.locale === "en" ? "50k" : "5万"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡{" "}
                {t.locale === "en"
                  ? "Amount will be stored encrypted on the blockchain"
                  : "金额将以加密形式存储在区块链上"}
              </p>
            </div>

            {/* Encryption Process Visualization */}
            {isEncrypting && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-purple-900 text-lg">
                        🔐 {t.locale === "en" ? "FHE Encryption in Progress..." : "FHE 加密进行中..."}
                      </p>
                      <p className="text-sm text-purple-700 mt-1">
                        {t.locale === "en"
                          ? "Using fully homomorphic encryption to protect your data"
                          : "使用全同态加密技术保护您的数据"}
                      </p>
                    </div>
                  </div>

                  {/* Encryption Steps Animation */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-700">
                        {t.locale === "en" ? "Raw Data" : "原始数据"}: <strong>{formData.amount}</strong> ETH
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="animate-pulse w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-purple-700">
                        {t.locale === "en" ? "Encrypting with FHEVM..." : "正在使用 FHEVM 加密..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-50">
                      <span className="text-gray-400">○</span>
                      <span className="text-gray-500">
                        {t.locale === "en" ? "Generating encrypted ciphertext..." : "生成加密密文..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-30">
                      <span className="text-gray-400">○</span>
                      <span className="text-gray-500">
                        {t.locale === "en" ? "Storing to blockchain..." : "存储到区块链..."}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">⚠️ {errorMessage}</p>
              </div>
            )}

            <button
              onClick={handleSubmitSalary}
              disabled={
                isEncrypting ||
                isPending ||
                !formData.employeeAddress ||
                !formData.amount ||
                (useBlockchain && fhevmStatus !== "ready")
              }
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isEncrypting || isPending
                ? "🔐 加密中..."
                : useBlockchain
                  ? t.salary.submitBlockchain
                  : t.salary.submitDemo}
            </button>
          </div>
        </div>
      )}

      {/* View Salary Form */}
      {showViewForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.salary.view}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.salary.employeeAddress}</label>
              <input
                type="text"
                value={viewAddress}
                onChange={e => setViewAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            {/* Decryption Process Visualization */}
            {isDecrypting && (
              <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  <div>
                    <p className="font-semibold text-indigo-900">
                      {t.locale === "en" ? "Decrypting..." : "正在解密..."}
                    </p>
                    <p className="text-sm text-indigo-700">
                      {t.locale === "en"
                        ? "🔐 Encrypted Data → 🔓 Decrypting → ✅ Decrypted"
                        : "🔐 加密数据 → 🔓 解密中 → ✅ 已解密"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleViewSalary}
              disabled={
                isDecrypting || isDecryptingFromHook || !viewAddress || (useBlockchain && fhevmStatus !== "ready")
              }
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDecrypting || isDecryptingFromHook
                ? "解密中..."
                : useBlockchain
                  ? t.salary.viewBlockchain
                  : t.salary.viewDemo}
            </button>
          </div>
        </div>
      )}

      {/* Salaries List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t.locale === "en" ? "Salary List" : "薪资列表"}</h3>
        </div>
        {salaries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-600 mb-2">{t.salary.noSalaries}</p>
            <p className="text-sm text-gray-500">{t.salary.noSalariesTip}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.locale === "en" ? "Employee" : "员工"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.locale === "en" ? "Address" : "地址"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.locale === "en" ? "Salary" : "薪资"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.locale === "en" ? "Status" : "状态"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.locale === "en" ? "Submission Time" : "提交时间"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.map(salary => (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{salary.employeeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-600">
                        {salary.employeeAddress.slice(0, 10)}...{salary.employeeAddress.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {salary.encrypted ? (t.locale === "en" ? "🔒 Encrypted" : "🔒 已加密") : `$${salary.amount}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          salary.encrypted ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {salary.encrypted
                          ? t.locale === "en"
                            ? "Encrypted"
                            : "加密"
                          : t.locale === "en"
                            ? "Decrypted"
                            : "已解密"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{salary.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-2">
          💡 {t.locale === "en" ? "FHE Encryption Features" : "FHE 加密特性"}
        </h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• {t.salary.feature1}</li>
          <li>• {t.salary.feature2}</li>
          <li>• {t.locale === "en" ? "Smart contracts cannot see raw salary data" : "智能合约无法看到原始薪资数据"}</li>
          <li>• {t.salary.feature3}</li>
        </ul>
      </div>
    </div>
  );
}
