#!/usr/bin/env node

import { Command } from "commander";
import { createExample } from "./createExample.js";
import { createCategory } from "./createCategory.js";
import chalk from "chalk";

const program = new Command();

program
  .name("create-fhevm-example")
  .description("CLI tool to create FHEVM example projects")
  .version("1.0.0");

program
  .command("example")
  .description("Create a new FHEVM example project")
  .argument("<name>", "Example project name")
  .option("-t, --template <template>", "Template to use", "basic")
  .option("-c, --category <category>", "Category name", "basic")
  .action(async (name, options) => {
    try {
      await createExample(name, options.template, options.category);
      console.log(chalk.green(`\n✅ Example "${name}" created successfully!`));
    } catch (error: any) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command("category")
  .description("Create a new category of examples")
  .argument("<name>", "Category name")
  .action(async (name) => {
    try {
      await createCategory(name);
      console.log(chalk.green(`\n✅ Category "${name}" created successfully!`));
    } catch (error: any) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();

