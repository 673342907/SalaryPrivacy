import * as fs from "fs-extra";
import * as path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, "../templates");
const BASE_TEMPLATE = path.join(TEMPLATES_DIR, "base");

export async function createExample(
  name: string,
  template: string = "basic",
  category: string = "basic"
) {
  console.log(chalk.blue(`\n🚀 Creating FHEVM example: ${name}`));
  console.log(chalk.gray(`   Template: ${template}`));
  console.log(chalk.gray(`   Category: ${category}\n`));

  // 验证名称
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error("Example name must contain only lowercase letters, numbers, and hyphens");
  }

  // 确定输出目录
  const outputDir = path.join(process.cwd(), name);

  // 检查目录是否存在
  if (await fs.pathExists(outputDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `Directory "${name}" already exists. Overwrite?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      throw new Error("Operation cancelled");
    }

    await fs.remove(outputDir);
  }

  // 复制基础模板
  console.log(chalk.gray("📦 Copying base template..."));
  await fs.copy(BASE_TEMPLATE, outputDir);

  // 检查模板是否存在
  const contractTemplatePath = path.join(TEMPLATES_DIR, `contracts/${template}.sol`);
  if (!(await fs.pathExists(contractTemplatePath))) {
    throw new Error(`Template "${template}" not found. Available templates: basic, access-control, arithmetic`);
  }

  // 读取模板文件
  const contractTemplate = await fs.readFile(contractTemplatePath, "utf-8");

  // 替换占位符
  const contractContent = contractTemplate
    .replace(/{{NAME}}/g, name)
    .replace(/{{CONTRACT_NAME}}/g, toPascalCase(name));

  // 写入合约文件
  await fs.writeFile(
    path.join(outputDir, "contracts", `${toPascalCase(name)}.sol`),
    contractContent
  );

  // 读取测试模板
  const testTemplatePath = path.join(TEMPLATES_DIR, `tests/${template}.test.ts`);
  if (!(await fs.pathExists(testTemplatePath))) {
    // 如果没有特定模板的测试，使用基础测试模板
    const basicTestPath = path.join(TEMPLATES_DIR, `tests/basic.test.ts`);
    if (await fs.pathExists(basicTestPath)) {
      const testTemplate = await fs.readFile(basicTestPath, "utf-8");
      const testContent = testTemplate
        .replace(/{{NAME}}/g, name)
        .replace(/{{CONTRACT_NAME}}/g, toPascalCase(name));
      await fs.writeFile(
        path.join(outputDir, "test", `${toPascalCase(name)}.test.ts`),
        testContent
      );
    }
    return;
  }

  const testTemplate = await fs.readFile(testTemplatePath, "utf-8");

  const testContent = testTemplate
    .replace(/{{NAME}}/g, name)
    .replace(/{{CONTRACT_NAME}}/g, toPascalCase(name));

  // 写入测试文件
  await fs.writeFile(
    path.join(outputDir, "test", `${toPascalCase(name)}.test.ts`),
    testContent
  );

  // 读取 README 模板
  const readmeTemplate = await fs.readFile(
    path.join(TEMPLATES_DIR, "README.md"),
    "utf-8"
  );

  const readmeContent = readmeTemplate
    .replace(/{{NAME}}/g, name)
    .replace(/{{CONTRACT_NAME}}/g, toPascalCase(name))
    .replace(/{{CATEGORY}}/g, category);

  await fs.writeFile(path.join(outputDir, "README.md"), readmeContent);

  // 更新 package.json
  const packageJson = await fs.readJson(path.join(outputDir, "package.json"));
  packageJson.name = name;
  packageJson.description = `FHEVM example: ${name}`;
  await fs.writeJson(path.join(outputDir, "package.json"), packageJson, { spaces: 2 });

  console.log(chalk.green(`\n✅ Example created at: ${outputDir}`));
  console.log(chalk.blue("\n📋 Next steps:"));
  console.log(chalk.gray(`   cd ${name}`));
  console.log(chalk.gray("   pnpm install"));
  console.log(chalk.gray("   pnpm test"));
}

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

