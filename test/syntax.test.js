const { test } = require("node:test");
const { execFileSync } = require("node:child_process");
const { readdirSync, statSync } = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const skip = new Set(["node_modules", "public", ".git"]);

function jsFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (skip.has(name)) return [];
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return jsFiles(full);
    return name.endsWith(".js") ? [full] : [];
  });
}

test("every server file parses", () => {
  for (const file of jsFiles(root)) {
    execFileSync(process.execPath, ["--check", file]);
  }
});
