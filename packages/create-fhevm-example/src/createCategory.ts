import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";

export async function createCategory(name: string) {
  console.log(chalk.blue(`\n📁 Creating category: ${name}\n`));

  const categoryDir = path.join(process.cwd(), name);

  if (await fs.pathExists(categoryDir)) {
    throw new Error(`Category "${name}" already exists`);
  }

  await fs.ensureDir(categoryDir);

  // 创建 category README
  const readme = `# ${name} Examples

This category contains FHEVM examples related to ${name}.

## Examples

- Add your examples here

## Documentation

See the main [FHEVM Examples Documentation](../../README.md) for more information.
`;

  await fs.writeFile(path.join(categoryDir, "README.md"), readme);

  console.log(chalk.green(`✅ Category created at: ${categoryDir}`));
}

