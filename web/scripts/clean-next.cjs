/* eslint-disable @typescript-eslint/no-require-imports -- small Node bootstrap */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
for (const name of fs.readdirSync(root)) {
  if (name === ".next" || name.startsWith(".next-port-")) {
    fs.rmSync(path.join(root, name), { recursive: true, force: true });
    console.log("removed:", name);
  }
}
