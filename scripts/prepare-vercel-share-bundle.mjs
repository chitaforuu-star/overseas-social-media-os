import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.resolve(repoRoot, "vercel-share-bundle");

const payloadSeeds = [
  "app",
  "components",
  "data/topic-materials.json",
  "lib",
  "next.config.ts",
  "postcss.config.mjs",
  "proxy.ts",
  "tsconfig.json",
];

function walk(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  const stat = fs.statSync(absolutePath);

  if (stat.isDirectory()) {
    return fs
      .readdirSync(absolutePath, { withFileTypes: true })
      .flatMap((entry) => walk(path.join(relativePath, entry.name)))
      .sort((left, right) => left.localeCompare(right));
  }

  return [relativePath];
}

function ensureCleanDirectory(directory) {
  fs.rmSync(directory, { recursive: true, force: true });
  fs.mkdirSync(directory, { recursive: true });
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

ensureCleanDirectory(outputDir);

const payloadFiles = Array.from(
  new Set(payloadSeeds.flatMap((seed) => walk(seed)).map((filePath) => toPosix(filePath))),
).sort((left, right) => left.localeCompare(right));

const payload = {
  generatedAt: new Date().toISOString(),
  files: payloadFiles.map((relativePath) => {
    const absolutePath = path.join(repoRoot, relativePath);
    const buffer = fs.readFileSync(absolutePath);

    return {
      path: relativePath,
      data: buffer.toString("base64"),
    };
  }),
};

const packageJson = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"),
);

packageJson.scripts = {
  ...packageJson.scripts,
  dev: "node bootstrap.mjs && next dev",
  build: "node bootstrap.mjs && next build",
  start: "node bootstrap.mjs && next start",
};

writeJson(path.join(outputDir, "package.json"), packageJson);
fs.copyFileSync(
  path.join(repoRoot, "package-lock.json"),
  path.join(outputDir, "package-lock.json"),
);
fs.copyFileSync(
  path.join(repoRoot, ".gitignore"),
  path.join(outputDir, ".gitignore"),
);
fs.copyFileSync(
  path.join(repoRoot, ".env.example"),
  path.join(outputDir, ".env.example"),
);
fs.copyFileSync(
  path.join(repoRoot, "README.md"),
  path.join(outputDir, "README.md"),
);

fs.writeFileSync(
  path.join(outputDir, "next-env.d.ts"),
  [
    '/// <reference types="next" />',
    '/// <reference types="next/image-types/global" />',
    "",
    "// NOTE: This file should not be edited",
    "// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.",
    "",
  ].join("\n"),
  "utf8",
);

fs.writeFileSync(
  path.join(outputDir, "bootstrap.mjs"),
  [
    'import fs from "node:fs";',
    'import path from "node:path";',
    'import { fileURLToPath } from "node:url";',
    "",
    "const rootDir = path.dirname(fileURLToPath(import.meta.url));",
    'const payloadPath = path.join(rootDir, "site-payload.json");',
    'const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));',
    "",
    "for (const entry of payload.files) {",
    "  const targetPath = path.join(rootDir, entry.path);",
    "  fs.mkdirSync(path.dirname(targetPath), { recursive: true });",
    '  fs.writeFileSync(targetPath, Buffer.from(entry.data, "base64"));',
    "}",
    "",
    'console.log(`Restored ${payload.files.length} files from site-payload.json`);',
    "",
  ].join("\n"),
  "utf8",
);

writeJson(path.join(outputDir, "site-payload.json"), payload);

fs.writeFileSync(
  path.join(outputDir, "UPLOAD-CHECKLIST.md"),
  [
    "# Vercel Share Bundle",
    "",
    "Upload every file in this folder to the root of the GitHub repository.",
    "",
    "Files:",
    "- .env.example",
    "- .gitignore",
    "- README.md",
    "- UPLOAD-CHECKLIST.md",
    "- bootstrap.mjs",
    "- next-env.d.ts",
    "- package-lock.json",
    "- package.json",
    "- site-payload.json",
    "",
    "After the GitHub commit:",
    "1. Import the repository into Vercel.",
    "2. Deploy.",
    "",
  ].join("\n"),
  "utf8",
);

console.log(`Prepared Vercel share bundle at: ${outputDir}`);
console.log(`Payload files packed: ${payload.files.length}`);
