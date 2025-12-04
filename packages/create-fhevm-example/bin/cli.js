#!/usr/bin/env node

import { createRequire } from "module";
const require = createRequire(import.meta.url);

// 使用编译后的文件
try {
  require("../dist/cli.js");
} catch (error) {
  // 如果未编译，使用 tsx 运行
  const { register } = require("tsx/esm/api");
  register();
  await import("../src/cli.ts");
}

