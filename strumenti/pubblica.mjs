// Pubblicazione del sito (GitHub Pages: pubblicare = mandare su GitHub il ramo main).
//
//   node strumenti/pubblica.mjs                      → dice solo cosa c'è da pubblicare e lancia i test (non pubblica)
//   node strumenti/pubblica.mjs --ok --messaggio "…"  → lancia i test; se passano, scrive CHANGELOG.md, salva e pubblica
//
// Se un test fallisce non pubblica mai. Senza --ok non pubblica mai.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RADICE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const git = (...a) => execFileSync("git", a, { cwd: RADICE, encoding: "utf8" }).trim();
const args = process.argv.slice(2);
const ok = args.includes("--ok");
const iMsg = args.indexOf("--messaggio");
const messaggio = iMsg >= 0 ? args[iMsg + 1] : "";

if (git("rev-parse", "--abbrev-ref", "HEAD") !== "main") { console.error("Non sei sul ramo main: mi fermo."); process.exit(1); }
try { git("fetch", "origin", "main"); } catch { console.error("Non riesco a contattare GitHub: mi fermo."); process.exit(1); }

// 1. cosa non è ancora pubblicato
const nonSalvati = git("status", "--porcelain").split("\n").filter(Boolean);
const daPubblicare = git("log", "--format=%s", "origin/main..HEAD").split("\n").filter(Boolean);
const indietro = Number(git("rev-list", "--count", "HEAD..origin/main"));
if (indietro > 0) { console.error("Su GitHub ci sono " + indietro + " modifiche che qui non hai (es. fatte da telefono). Aggiorna prima in locale: mi fermo."); process.exit(1); }

if (!nonSalvati.length && !daPubblicare.length) {
  console.log("Non ci sono modifiche da pubblicare: il sito online è già uguale alla cartella locale.");
  process.exit(0);
}
console.log("Modifiche non ancora pubblicate:");
daPubblicare.forEach((s) => console.log("  • salvata: " + s));
nonSalvati.forEach((r) => console.log("  • da salvare: " + r));

// 2. test
console.log("\nLancio i test…");
const t = spawnSync(process.execPath, ["--test", "tests/sito.test.mjs"], { cwd: RADICE, encoding: "utf8" });
const riga = (k) => (t.stdout.match(new RegExp("^# " + k + " (\\d+)", "m")) || [])[1];
console.log("Test: " + riga("pass") + " ok, " + riga("fail") + " falliti.");
if (t.status !== 0) {
  console.error("\nPUBBLICAZIONE RIFIUTATA: un test è fallito.\n" + t.stdout.split("\n").filter((l) => /^not ok|^\s+[+-] |error:/.test(l)).join("\n"));
  process.exit(1);
}
if (!ok) { console.log("\nTutto in ordine, ma NON ho pubblicato. Per pubblicare serve il tuo ok."); process.exit(0); }
if (nonSalvati.length && !messaggio) { console.error("Ci sono modifiche da salvare: serve --messaggio \"…\"."); process.exit(1); }

// 3. registro CHANGELOG.md
const fileLog = path.join(RADICE, "CHANGELOG.md");
const vecchio = fs.existsSync(fileLog) ? fs.readFileSync(fileLog, "utf8") : "# Registro delle pubblicazioni\n";
const versione = "v" + ((vecchio.match(/^## v\d+/gm) || []).length + 1);
const data = new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
const riepilogo = [...daPubblicare, ...(messaggio ? [messaggio.split("\n")[0]] : [])];
const voce = "\n## " + versione + " – " + data + "\n" + riepilogo.map((s) => "- " + s).join("\n") + "\n";
const [titolo, ...resto] = vecchio.split("\n");
fs.writeFileSync(fileLog, titolo + "\n" + voce + resto.join("\n"));

// 4. salvo e pubblico
const fileCambiati = new Set(nonSalvati.map((r) => r.slice(3)).concat(git("diff", "--name-only", "origin/main..HEAD").split("\n")).filter(Boolean));
git("add", "-A");
git("commit", "-m", messaggio || "Registro modifiche " + versione);
git("push", "origin", "main");
console.log("\nPUBBLICATO " + versione + ". GitHub aggiorna il sito in circa un minuto: https://www.iltoccodellarosa.it/");

// pagine da controllare online dopo la pubblicazione
const tutte = fs.readdirSync(RADICE).filter((f) => f.endsWith(".html") && !f.startsWith("google") && f !== "manutenzione.html");
const daControllare = new Set();
for (const f of fileCambiati) {
  if (f.endsWith(".html")) daControllare.add(f);
  else if (f === "assets/dati.js") ["cani.html", "cuccioli.html", "galleria.html"].forEach((p) => daControllare.add(p));
  else if (/^assets\/(site\.js|style\.css|config\.js)$/.test(f)) tutte.forEach((p) => daControllare.add(p));
  else if (f.startsWith("foto/")) ["cani.html", "cuccioli.html", "galleria.html", "index.html"].forEach((p) => daControllare.add(p));
}
console.log("Pagine da controllare online: " + ([...daControllare].join(", ") || "nessuna in particolare"));
