// Upgrades the icon packages, refreshes Lucide's icon metadata, regenerates
// src/icons, and reports which icon names were added or removed.
//
//   yarn icons:update             upgrade + refresh metadata + regenerate + typecheck
//                                 (only to versions older than Yarn's npmMinimalAgeGate)
//   yarn icons:update --check     only show what's outdated; change nothing
//   yarn icons:update --metadata  re-fetch metadata even if it looks current
//
// Sources:
//   lucide-react   (npm) → Lucide icons and DynamicIcon names
//   @lucide/lab    (npm) → Lab icons
//   react-icons    (npm) → react-icons packs
//   lucide repo   (git)  → tags, categories and aliases for Lucide and Lab icons,
//                          read from icons/*.json, lab/*.json and categories/*.json
//                          at the tag matching lucide-react's version. Saved to
//                          scripts/data/lucide-metadata.json so builds stay offline.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const metadataPath = join(root, "scripts/data/lucide-metadata.json");
const LUCIDE_REPO = "https://github.com/lucide-icons/lucide.git";

const checkOnly = process.argv.includes("--check");
const forceMetadata = process.argv.includes("--metadata");

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], ...opts })?.trim() ?? "";

const installed = (name) => JSON.parse(readFileSync(join(root, "node_modules", name, "package.json"), "utf8")).version;
// Yarn passes its own npm_config_* vars to child processes, which makes npm warn.
const npmEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("npm_config_")));
// Honour Yarn's release quarantine: only versions published at least
// npmMinimalAgeGate minutes ago are eligible, same as `yarn install` would allow.
const ageGateMinutes = Number(run("yarn", ["config", "get", "npmMinimalAgeGate"])) || 0;
const semverParts = (v) => v.split(".").map(Number);
const semverCompare = (a, b) => {
  const [x, y] = [semverParts(a), semverParts(b)];
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};
const tooNew = {};
function latest(name) {
  const times = JSON.parse(run("npm", ["view", name, "time", "--json"], { env: npmEnv }));
  const cutoff = Date.now() - ageGateMinutes * 60_000;
  const stable = Object.entries(times)
    .filter(([v]) => /^\d+\.\d+\.\d+$/.test(v))
    .sort(([a], [b]) => semverCompare(a, b));
  const allowed = stable.filter(([, t]) => Date.parse(t) <= cutoff);
  const newest = stable.at(-1);
  const pick = allowed.at(-1);
  if (newest && pick && newest[0] !== pick[0]) {
    const hours = Math.round((Date.now() - Date.parse(newest[1])) / 3_600_000);
    tooNew[name] = `${newest[0]} is ${hours}h old`;
  }
  return pick?.[0] ?? installed(name);
}
const metadataVersion = () =>
  existsSync(metadataPath) ? JSON.parse(readFileSync(metadataPath, "utf8")).version : "none";

// ── Versions ────────────────────────────────────────────────────────────────
const deps = ["lucide-react", "@lucide/lab", "react-icons"];
const versions = Object.fromEntries(deps.map((name) => [name, { current: installed(name), latest: latest(name) }]));
// Metadata must describe the icon set lucide-react ships.
versions["lucide metadata"] = { current: metadataVersion(), latest: versions["lucide-react"].latest };

console.log(`Icon sources (newest versions at least ${ageGateMinutes / 60}h old):`);
for (const [name, v] of Object.entries(versions)) {
  const mark = v.current === v.latest ? "up to date" : `${v.current} → ${v.latest}`;
  const held = tooNew[name] ? `  (${tooNew[name]}, still quarantined)` : "";
  console.log(`  ${name.padEnd(16)} ${mark}${held}`);
}

const outdated = Object.entries(versions).filter(([, v]) => v.current !== v.latest);
if (checkOnly) process.exit(0);
if (!outdated.length && !forceMetadata) {
  console.log("\nNothing to update.");
  process.exit(0);
}

// ── Snapshot current names ──────────────────────────────────────────────────
function snapshot() {
  const icons = join(root, "src/icons");
  const read = (f) => (existsSync(join(icons, f)) ? readFileSync(join(icons, f), "utf8") : "");
  const lucideList = read("lucide-names.ts").match(/= (\[.*\]);/)?.[1];
  return {
    lucide: new Set(lucideList ? JSON.parse(lucideList) : []),
    lab: new Set([...read("lab-names.ts").matchAll(/^ {2}"([a-z0-9-]+)",$/gm)].map((m) => m[1])),
    packs: new Set(JSON.parse(read("entries.json") || "[]")),
  };
}
const before = snapshot();

// ── Upgrade packages ────────────────────────────────────────────────────────
const upgrades = deps.filter((d) => versions[d].current !== versions[d].latest).map((d) => `${d}@^${versions[d].latest}`);
if (upgrades.length) run("yarn", ["add", ...upgrades], { stdio: "inherit" });

// ── Refresh Lucide metadata ─────────────────────────────────────────────────
function fetchMetadata(version) {
  const dir = mkdtempSync(join(tmpdir(), "lucide-meta-"));
  try {
    console.log(`\nFetching Lucide metadata for ${version}…`);
    run("git", ["-c", "advice.detachedHead=false", "clone", "-q", "--depth", "1", "--filter=blob:none", "--sparse", "--branch", version, LUCIDE_REPO, dir], {
      stdio: ["ignore", "ignore", "inherit"],
    });
    run("git", ["sparse-checkout", "set", "--no-cone", "/icons/*.json", "/lab/*.json", "/categories/*.json"], {
      cwd: dir,
    });

    const readDir = (sub) => {
      const path = join(dir, sub);
      if (!existsSync(path)) return [];
      return readdirSync(path)
        .filter((f) => f.endsWith(".json"))
        .map((f) => [f.slice(0, -5), JSON.parse(readFileSync(join(path, f), "utf8"))]);
    };

    const icon = (d) => ({
      tags: d.tags ?? [],
      categories: d.categories ?? [],
      ...(d.aliases?.length && { aliases: d.aliases.map((a) => (typeof a === "string" ? a : a.name)) }),
      ...(d.deprecated && { deprecated: true }),
    });

    const sortObj = (entries) => Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));
    return {
      version,
      source: `${LUCIDE_REPO.replace(/\.git$/, "")}/tree/${version}`,
      categories: sortObj(readDir("categories").map(([id, d]) => [id, d.title ?? id])),
      icons: sortObj(readDir("icons").map(([name, d]) => [name, icon(d)])),
      lab: sortObj(readDir("lab").map(([name, d]) => [name, icon(d)])),
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const lucideVersion = installed("lucide-react");
if (forceMetadata || metadataVersion() !== lucideVersion) {
  const meta = fetchMetadata(lucideVersion);
  mkdirSync(dirname(metadataPath), { recursive: true });
  writeFileSync(metadataPath, JSON.stringify(meta, null, 1) + "\n");
  console.log(
    `Saved metadata: ${Object.keys(meta.icons).length} icons, ${Object.keys(meta.lab).length} lab icons, ` +
      `${Object.keys(meta.categories).length} categories.`,
  );
}

// ── Regenerate ──────────────────────────────────────────────────────────────
run("node", ["scripts/gen-icons.mjs"], { stdio: "inherit" });
const after = snapshot();

// ── Report ──────────────────────────────────────────────────────────────────
// Names that left a list but still render under the same name aren't breaking.
const diff = (label, a, b, stillAvailable = new Set(), note = "") => {
  const added = [...b].filter((n) => !a.has(n));
  const gone = [...a].filter((n) => !b.has(n));
  const kept = gone.filter((n) => stillAvailable.has(n));
  const removed = gone.filter((n) => !stillAvailable.has(n));
  console.log(`\n${label}: ${b.size} (${added.length} added, ${removed.length} removed)`);
  if (added.length) console.log(`  + ${added.join(", ")}`);
  if (removed.length) console.log(`  - ${removed.join(", ")}`);
  if (kept.length) console.log(`  ~ ${note}: ${kept.join(", ")}`);
  return removed.length;
};
// Every name lucide-react can still render (includes aliases and deprecated icons).
const { iconNames: loadableNow } = await import("lucide-react/dynamic");
const lucideLoadable = new Set(loadableNow);
let removed = 0;
removed += diff("Lucide icons in the picker", before.lucide, after.lucide, lucideLoadable, "deprecated, hidden from the picker but still usable");
removed += diff("Lab icons", before.lab, after.lab, after.lucide, "promoted to Lucide, same name");
removed += diff("react-icons entry points", before.packs, after.packs);

if (removed) {
  console.log(
    "\n⚠ Some names were removed. Apps that import or store them (e.g. IconPicker values) will break;" +
      " treat this as a breaking change when releasing.",
  );
}

console.log("\nType-checking…");
try {
  run("yarn", ["typecheck"], { stdio: "inherit" });
  console.log("Done. Review the diff, then commit and tag a release.");
} catch {
  console.error("\nType check failed (see above). The icon files were regenerated; fix the errors before releasing.");
  process.exitCode = 1;
}
