// Upgrades the icon packages to their latest versions, regenerates src/icons,
// and reports which icon names were added or removed.
//
//   yarn icons:update           upgrade, regenerate, typecheck
//   yarn icons:update --check   only show available versions; change nothing
//
// Icon names come straight from npm packages, so there is nothing to scrape:
//   lucide-react   → Lucide icons (and DynamicIcon names)
//   lucide-static  → Lucide search tags (dev-only, kept on lucide-react's version)
//   @lucide/lab    → Lab icons
//   react-icons    → react-icons packs
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], ...opts })?.trim() ?? "";

const installed = (name) => JSON.parse(readFileSync(join(root, "node_modules", name, "package.json"), "utf8")).version;
// Yarn passes its own npm_config_* vars to child processes, which makes npm warn.
const npmEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("npm_config_")));
const latest = (name) => run("npm", ["view", name, "version"], { env: npmEnv });

// ── Versions ────────────────────────────────────────────────────────────────
const deps = ["lucide-react", "@lucide/lab", "react-icons"];
const versions = Object.fromEntries(
  [...deps, "lucide-static"].map((name) => [name, { current: installed(name), latest: latest(name) }]),
);
// Tags must describe the same icon set lucide-react ships.
versions["lucide-static"].latest = versions["lucide-react"].latest;

console.log("Icon packages:");
for (const [name, v] of Object.entries(versions)) {
  const mark = v.current === v.latest ? "up to date" : `${v.current} → ${v.latest}`;
  console.log(`  ${name.padEnd(14)} ${mark}`);
}

const outdated = Object.entries(versions).filter(([, v]) => v.current !== v.latest);
if (checkOnly) process.exit(0);
if (!outdated.length) {
  console.log("\nNothing to update.");
  process.exit(0);
}

// ── Snapshot current names ──────────────────────────────────────────────────
function snapshot() {
  const icons = join(root, "src/icons");
  const read = (f) => (existsSync(join(icons, f)) ? readFileSync(join(icons, f), "utf8") : "");
  return {
    lucide: new Set(Object.keys(JSON.parse(read("tags.json") || "{}"))),
    lab: new Set([...read("lab-names.ts").matchAll(/^ {2}"([a-z0-9-]+)",$/gm)].map((m) => m[1])),
    packs: new Set(JSON.parse(read("entries.json") || "[]")),
  };
}
const before = snapshot();

// ── Upgrade + regenerate ────────────────────────────────────────────────────
const range = (name) => `${name}@^${versions[name].latest}`;

const prodUpgrades = deps.filter((d) => versions[d].current !== versions[d].latest).map(range);
if (prodUpgrades.length) run("yarn", ["add", ...prodUpgrades], { stdio: "inherit" });
if (versions["lucide-static"].current !== versions["lucide-static"].latest) {
  run("yarn", ["add", "-D", range("lucide-static")], { stdio: "inherit" });
}

run("node", ["scripts/gen-icons.mjs"], { stdio: "inherit" });
const after = snapshot();

// ── Report ──────────────────────────────────────────────────────────────────
// `moved` names left this set but still exist elsewhere under the same name.
const diff = (label, a, b, elsewhere = new Set()) => {
  const added = [...b].filter((n) => !a.has(n));
  const gone = [...a].filter((n) => !b.has(n));
  const moved = gone.filter((n) => elsewhere.has(n));
  const removed = gone.filter((n) => !elsewhere.has(n));
  console.log(`\n${label}: ${b.size} (${added.length} added, ${removed.length} removed, ${moved.length} moved)`);
  if (added.length) console.log(`  + ${added.join(", ")}`);
  if (removed.length) console.log(`  - ${removed.join(", ")}`);
  if (moved.length) console.log(`  → promoted to Lucide, same name: ${moved.join(", ")}`);
  return removed.length;
};
let removed = 0;
removed += diff("Lucide icons", before.lucide, after.lucide);
removed += diff("Lab icons", before.lab, after.lab, after.lucide);
removed += diff("react-icons entry points", before.packs, after.packs);

if (removed) {
  console.log(
    "\n⚠ Some names were removed. Apps that import or store them (e.g. IconPicker values) will break;" +
      " treat this as a breaking change when releasing.",
  );
}

console.log("\nType-checking…");
run("yarn", ["-s", "typecheck"], { stdio: "inherit" });
console.log("Done. Review the diff, then commit and tag a release.");
