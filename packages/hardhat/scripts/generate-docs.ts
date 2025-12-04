import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

/**
 * @file generate-docs.ts
 * @author ConfidentialSalary Team
 * @description 自动生成文档的脚本
 * 
 * 功能：
 * - 从 Solidity 合约注释提取文档
 * - 生成 README.md
 * - 生成 GitBook 兼容的文档
 * - 支持章节标签（@custom:chapter）
 */

interface ContractDoc {
  title: string;
  description: string;
  chapters: string[];
  functions: FunctionDoc[];
  examples: string[];
  antipatterns: string[];
}

interface FunctionDoc {
  name: string;
  description: string;
  params: { name: string; type: string; description: string }[];
  returns: { type: string; description: string };
  examples: string[];
  important: string[];
  chapters: string[];
}

/**
 * 提取 Solidity 合约文档
 */
function extractContractDoc(contractPath: string): ContractDoc {
  const content = fs.readFileSync(contractPath, "utf-8");
  
  // 提取合约标题和描述
  const titleMatch = content.match(/@title\s+(.+)/);
  const title = titleMatch ? titleMatch[1].trim() : "Contract";
  
  const descriptionMatch = content.match(/@notice\s+(.+?)(?=@|$)/s);
  const description = descriptionMatch ? descriptionMatch[1].trim() : "";
  
  // 提取章节
  const chapterMatches = content.matchAll(/@custom:chapter\s+(\w+)/g);
  const chapters = Array.from(chapterMatches, m => m[1]);
  
  // 提取函数文档
  const functions: FunctionDoc[] = [];
  const functionRegex = /\/\*\*[\s\S]*?\*\/\s*function\s+(\w+)/g;
  let match;
  
  while ((match = functionRegex.exec(content)) !== null) {
    const funcDoc = extractFunctionDoc(match[0], match[1]);
    if (funcDoc) {
      functions.push(funcDoc);
    }
  }
  
  // 提取示例
  const exampleMatches = content.matchAll(/@custom:example\s+```[\s\S]*?```/g);
  const examples = Array.from(exampleMatches, m => m[0].replace(/@custom:example\s+/, ""));
  
  // 提取反模式
  const antipatternMatches = content.matchAll(/@custom:antipattern\s+(\w+)/g);
  const antipatterns = Array.from(antipatternMatches, m => m[1]);
  
  return {
    title,
    description,
    chapters,
    functions,
    examples,
    antipatterns,
  };
}

/**
 * 提取函数文档
 */
function extractFunctionDoc(docBlock: string, funcName: string): FunctionDoc | null {
  const noticeMatch = docBlock.match(/@notice\s+(.+?)(?=@|$)/s);
  const description = noticeMatch ? noticeMatch[1].trim() : "";
  
  const paramMatches = docBlock.matchAll(/@param\s+(\w+)\s+(.+?)(?=@|$)/gs);
  const params = Array.from(paramMatches, m => {
    const parts = m[2].trim().split(/\s+/);
    return {
      name: m[1],
      type: parts[0] || "",
      description: parts.slice(1).join(" ") || "",
    };
  });
  
  const returnMatch = docBlock.match(/@return\s+(.+?)(?=@|$)/s);
  const returns = returnMatch
    ? {
        type: returnMatch[1].trim().split(/\s+/)[0] || "",
        description: returnMatch[1].trim().split(/\s+/).slice(1).join(" ") || "",
      }
    : { type: "", description: "" };
  
  const exampleMatches = docBlock.matchAll(/@custom:example\s+```[\s\S]*?```/g);
  const examples = Array.from(exampleMatches, m => m[0].replace(/@custom:example\s+/, ""));
  
  const importantMatches = docBlock.matchAll(/@custom:important\s+(.+?)(?=@|$)/gs);
  const important = Array.from(importantMatches, m => m[1].trim());
  
  const chapterMatches = docBlock.matchAll(/@custom:chapter\s+(\w+)/g);
  const chapters = Array.from(chapterMatches, m => m[1]);
  
  return {
    name: funcName,
    description,
    params,
    returns,
    examples,
    important,
    chapters,
  };
}

/**
 * 生成 README.md
 */
function generateREADME(contractDoc: ContractDoc, contractName: string): string {
  let readme = `# ${contractDoc.title}\n\n`;
  
  readme += `${contractDoc.description}\n\n`;
  
  // 章节
  if (contractDoc.chapters.length > 0) {
    readme += `## 📚 相关章节\n\n`;
    contractDoc.chapters.forEach((chapter) => {
      readme += `- **${chapter}**: 查看相关文档\n`;
    });
    readme += `\n`;
  }
  
  // 函数文档
  if (contractDoc.functions.length > 0) {
    readme += `## 🔧 函数文档\n\n`;
    contractDoc.functions.forEach((func) => {
      readme += `### \`${func.name}()\`\n\n`;
      readme += `${func.description}\n\n`;
      
      if (func.params.length > 0) {
        readme += `**参数：**\n\n`;
        func.params.forEach((param) => {
          readme += `- \`${param.name}\` (${param.type}): ${param.description}\n`;
        });
        readme += `\n`;
      }
      
      if (func.returns.type) {
        readme += `**返回值：** \`${func.returns.type}\` - ${func.returns.description}\n\n`;
      }
      
      if (func.important.length > 0) {
        readme += `**重要提示：**\n\n`;
        func.important.forEach((item) => {
          readme += `- ${item}\n`;
        });
        readme += `\n`;
      }
      
      if (func.examples.length > 0) {
        readme += `**示例：**\n\n`;
        func.examples.forEach((example) => {
          readme += `${example}\n\n`;
        });
      }
      
      readme += `---\n\n`;
    });
  }
  
  // 示例
  if (contractDoc.examples.length > 0) {
    readme += `## 💡 使用示例\n\n`;
    contractDoc.examples.forEach((example, index) => {
      readme += `### 示例 ${index + 1}\n\n`;
      readme += `${example}\n\n`;
    });
  }
  
  // 反模式
  if (contractDoc.antipatterns.length > 0) {
    readme += `## ⚠️ 常见反模式\n\n`;
    readme += `以下是一些常见的错误用法，请避免：\n\n`;
    contractDoc.antipatterns.forEach((pattern) => {
      readme += `- **${pattern}**: 查看相关文档了解正确用法\n`;
    });
    readme += `\n`;
  }
  
  readme += `## 📖 更多信息\n\n`;
  readme += `- [FHEVM 文档](https://docs.zama.org/protocol)\n`;
  readme += `- [Zama Bounty Program](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)\n`;
  
  return readme;
}

/**
 * 生成 GitBook 兼容文档
 */
function generateGitBookDocs(contractDocs: Map<string, ContractDoc>): string {
  let gitbook = `# FHEVM Examples Documentation\n\n`;
  gitbook += `本文档由自动生成工具创建，包含所有 FHEVM 示例合约的文档。\n\n`;
  gitbook += `**最后更新：** ${new Date().toISOString().split('T')[0]}\n\n`;
  gitbook += `---\n\n`;
  
  // 按章节组织
  const chaptersMap = new Map<string, string[]>();
  
  contractDocs.forEach((doc, contractName) => {
    doc.chapters.forEach((chapter) => {
      if (!chaptersMap.has(chapter)) {
        chaptersMap.set(chapter, []);
      }
      chaptersMap.get(chapter)!.push(contractName);
    });
  });
  
  // 生成目录
  gitbook += `## 📑 目录\n\n`;
  gitbook += `- [简介](#简介)\n`;
  chaptersMap.forEach((contracts, chapter) => {
    gitbook += `- [${chapter}](#${chapter.toLowerCase().replace(/\s+/g, '-')})\n`;
  });
  gitbook += `\n---\n\n`;
  
  // 简介
  gitbook += `## 简介\n\n`;
  gitbook += `本文档包含 ${contractDocs.size} 个 FHEVM 示例合约的完整文档。\n\n`;
  gitbook += `每个示例都演示了 FHEVM 的不同方面：\n\n`;
  gitbook += `- 基础操作（加密、解密、算术运算）\n`;
  gitbook += `- 访问控制（FHE.allow, FHE.allowTransient）\n`;
  gitbook += `- 高级应用（盲拍卖、归属钱包）\n`;
  gitbook += `- 反模式（常见错误）\n\n`;
  gitbook += `---\n\n`;
  
  // 按章节生成文档
  chaptersMap.forEach((contracts, chapter) => {
    gitbook += `## ${chapter}\n\n`;
    gitbook += `本章节包含以下示例：\n\n`;
    contracts.forEach((contract) => {
      const doc = contractDocs.get(contract);
      if (doc) {
        gitbook += `### ${doc.title}\n\n`;
        gitbook += `**合约名称：** \`${contract}\`\n\n`;
        gitbook += `${doc.description}\n\n`;
        
        if (doc.functions.length > 0) {
          gitbook += `#### 函数列表\n\n`;
          doc.functions.forEach((func) => {
            gitbook += `##### ${func.name}()\n\n`;
            gitbook += `${func.description}\n\n`;
            if (func.params.length > 0) {
              gitbook += `**参数：**\n\n`;
              func.params.forEach((param) => {
                gitbook += `- \`${param.name}\` (${param.type}): ${param.description}\n`;
              });
              gitbook += `\n`;
            }
            if (func.returns.type) {
              gitbook += `**返回值：** \`${func.returns.type}\` - ${func.returns.description}\n\n`;
            }
          });
        }
        
        gitbook += `---\n\n`;
      }
    });
  });
  
  return gitbook;
}

/**
 * 生成 HTML 文档
 */
function generateHTMLDocs(contractDocs: Map<string, ContractDoc>): string {
  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FHEVM Examples Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .contract { margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 8px; }
        .function { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #007bff; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>FHEVM Examples Documentation</h1>
    <p>最后更新：${new Date().toISOString().split('T')[0]}</p>
`;

  contractDocs.forEach((doc, contractName) => {
    html += `    <div class="contract">
        <h2>${doc.title}</h2>
        <p><strong>合约名称：</strong><code>${contractName}</code></p>
        <p>${doc.description}</p>`;
    
    if (doc.functions.length > 0) {
      html += `        <h3>函数列表</h3>`;
      doc.functions.forEach((func) => {
        html += `        <div class="function">
            <h4>${func.name}()</h4>
            <p>${func.description}</p>`;
        if (func.params.length > 0) {
          html += `            <p><strong>参数：</strong></p><ul>`;
          func.params.forEach((param) => {
            html += `                <li><code>${param.name}</code> (${param.type}): ${param.description}</li>`;
          });
          html += `            </ul>`;
        }
        html += `        </div>`;
      });
    }
    
    html += `    </div>`;
  });

  html += `</body>
</html>`;

  return html;
}

/**
 * 主函数
 */
function main() {
  console.log("📝 开始生成文档...\n");
  
  const contractsDir = path.join(__dirname, "../contracts");
  const outputDir = path.join(__dirname, "../docs");
  
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const contractDocs = new Map<string, ContractDoc>();
  
  // 处理主合约
  const mainContractPath = path.join(contractsDir, "ConfidentialSalary.sol");
  if (fs.existsSync(mainContractPath)) {
    console.log(`处理主合约: ConfidentialSalary.sol`);
    const doc = extractContractDoc(mainContractPath);
    contractDocs.set("ConfidentialSalary", doc);
    
    // 生成 README
    const readme = generateREADME(doc, "ConfidentialSalary");
    fs.writeFileSync(path.join(outputDir, "ConfidentialSalary.md"), readme);
    console.log(`✅ 生成: ConfidentialSalary.md`);
  }
  
  // 处理示例合约
  const examplesDir = path.join(contractsDir, "examples");
  if (fs.existsSync(examplesDir)) {
    const exampleFiles = fs.readdirSync(examplesDir).filter((f) => f.endsWith(".sol"));
    
    exampleFiles.forEach((file) => {
      const contractPath = path.join(examplesDir, file);
      const contractName = path.basename(file, ".sol");
      
      console.log(`处理示例合约: ${file}`);
      const doc = extractContractDoc(contractPath);
      contractDocs.set(contractName, doc);
      
      // 生成 README
      const readme = generateREADME(doc, contractName);
      fs.writeFileSync(path.join(outputDir, `${contractName}.md`), readme);
      console.log(`✅ 生成: ${contractName}.md`);
    });
  }
  
  // 生成 GitBook 文档
  const gitbook = generateGitBookDocs(contractDocs);
  fs.writeFileSync(path.join(outputDir, "gitbook.md"), gitbook);
  console.log(`✅ 生成: gitbook.md`);
  
  // 生成 HTML 文档
  const html = generateHTMLDocs(contractDocs);
  fs.writeFileSync(path.join(outputDir, "index.html"), html);
  console.log(`✅ 生成: index.html`);
  
  // 生成总 README
  const mainReadme = generateMainREADME(contractDocs);
  fs.writeFileSync(path.join(outputDir, "README.md"), mainReadme);
  console.log(`✅ 生成: README.md`);
  
  console.log(`\n🎉 文档生成完成！`);
  console.log(`📁 输出目录: ${outputDir}`);
  console.log(`📄 文档格式: Markdown, GitBook, HTML`);
}

/**
 * 生成主 README
 */
function generateMainREADME(contractDocs: Map<string, ContractDoc>): string {
  let readme = `# FHEVM Examples\n\n`;
  readme += `完整的 FHEVM 示例集合，包含 ${contractDocs.size} 个示例合约。\n\n`;
  readme += `## 📚 示例列表\n\n`;
  
  // 按章节分组
  const chaptersMap = new Map<string, string[]>();
  contractDocs.forEach((doc, contractName) => {
    doc.chapters.forEach((chapter) => {
      if (!chaptersMap.has(chapter)) {
        chaptersMap.set(chapter, []);
      }
      chaptersMap.get(chapter)!.push(contractName);
    });
  });
  
  chaptersMap.forEach((contracts, chapter) => {
    readme += `### ${chapter}\n\n`;
    contracts.forEach((contract) => {
      const doc = contractDocs.get(contract);
      if (doc) {
        readme += `- **${doc.title}** (\`${contract}\`) - ${doc.description.split('.')[0]}\n`;
      }
    });
    readme += `\n`;
  });
  
  readme += `## 📖 文档\n\n`;
  readme += `- [GitBook 格式](./gitbook.md)\n`;
  readme += `- [HTML 格式](./index.html)\n`;
  readme += `- [各示例 README](./)\n\n`;
  
  readme += `## 🚀 使用\n\n`;
  readme += `每个示例都是独立的 Hardhat 项目，可以直接使用。\n\n`;
  readme += `\`\`\`bash\n`;
  readme += `cd <example-name>\n`;
  readme += `pnpm install\n`;
  readme += `pnpm test\n`;
  readme += `\`\`\`\n\n`;
  
  return readme;
}

main();

