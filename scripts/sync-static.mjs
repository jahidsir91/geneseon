import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "public");

await mkdir(publicDir, { recursive: true });
for (const entry of ["index.html", "css", "js", "assets", "images"]) {
  try {
    await cp(resolve(root, entry), resolve(publicDir, entry), {
      recursive: true,
      force: true,
    });
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}