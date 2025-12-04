# create-fhevm-example

CLI tool to create FHEVM example projects.

## Installation

```bash
pnpm add -g create-fhevm-example
```

Or use with npx:

```bash
npx create-fhevm-example
```

## Usage

### Create a new example

```bash
create-fhevm-example example my-example
```

Options:
- `-t, --template <template>` - Template to use (default: "basic")
- `-c, --category <category>` - Category name (default: "basic")

### Create a new category

```bash
create-fhevm-example category my-category
```

## Templates

- `basic` - Basic FHEVM example with storage

## Examples

```bash
# Create a basic example
create-fhevm-example example simple-counter

# Create an example in a specific category
create-fhevm-example example blind-auction -c advanced

# Create a new category
create-fhevm-example category advanced
```

## Features

- ✅ Automatic project scaffolding
- ✅ Template-based generation
- ✅ Test file generation
- ✅ README generation
- ✅ Hardhat configuration

---

**Part of ConfidentialSalary Project**

