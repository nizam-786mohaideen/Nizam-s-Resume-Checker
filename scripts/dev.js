import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error("Run this launcher with `npm run dev`.");
  process.exit(1);
}

const apps = ["backend", "frontend"];
const children = apps.map((app) => {
  const child = spawn(process.execPath, [npmCli, "run", "dev"], {
    cwd: path.join(rootDirectory, app),
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${app} stopped with exit code ${code}.`);
    }
  });

  return child;
});

function stopChildren() {
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
}

process.on("SIGINT", stopChildren);
process.on("SIGTERM", stopChildren);
