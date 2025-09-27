// scripts/patch-bucket.js
// Usage: node scripts/patch-bucket.js
//
// This script will:
// 1) Find any file containing "property-images"
// 2) Replace it with "property-images"
// 3) Replace fallbacks like
//    (() => {
       const _b = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
       if (!_b) {
         throw new Error("[config] Missing NEXT_PUBLIC_SUPABASE_BUCKET env. Add it to .env.local and restart.");
       }
       return _b;
     })()
//    with a strict env check
// 4) Make a .bak backup for each changed file

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const repoRoot = process.cwd();
const pattern = "**/*.{ts,tsx,js,jsx,env}";
const exclude = ["node_modules/**", ".git/**", ".next/**", "dist/**", "out/**", "public/**"];

const files = glob.sync(pattern, {
  cwd: repoRoot,
  nodir: true,
  absolute: true,
  ignore: exclude,
});

let modified = [];

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes("property-images")) continue;

  let updated = content.replace(/property-images/g, "property-images");

  // Replace fallback env var usage
  updated = updated.replace(
    /process\.env\.NEXT_PUBLIC_SUPABASE_BUCKET\s*\?\?\s*["'`]property-images["'`]/g,
    `(() => {
       const _b = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
       if (!_b) {
         throw new Error("[config] Missing NEXT_PUBLIC_SUPABASE_BUCKET env. Add it to .env.local and restart.");
       }
       return _b;
     })()`
  );

  if (updated !== content) {
    fs.writeFileSync(file + ".bak", content, "utf8"); // backup
    fs.writeFileSync(file, updated, "utf8");
    modified.push(path.relative(repoRoot, file));
  }
}

console.log("Patched files:", modified.length);
modified.forEach((f) => console.log("  •", f));
console.log("Backups created with .bak extension for each modified file.");
