// Test del sito Il Tocco della Rosa. Si lanciano con:  node --test tests/
// Nessuna installazione: usa solo Node. Il sito viene servito in locale su una porta libera,
// quindi i controlli "risponde 200" sono vere richieste, non solo controlli sull'esistenza dei file.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const RADICE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const leggi = (f) => fs.readFileSync(path.join(RADICE, f), "utf8");
const pagine = fs.readdirSync(RADICE).filter((f) => f.endsWith(".html") && !f.startsWith("google"));

// carica assets/config.js e assets/dati.js come fa il browser
const finestra = {};
vm.runInNewContext(leggi("assets/config.js") + "\n" + leggi("assets/dati.js"), { window: finestra });
const { CANI, CUCCIOLI, GALLERIA, ESPOSITORI = {} } = finestra;
const SITO = finestra.SITO;

// parole inglesi che non devono comparire nei testi italiani del sito
const INGLESE = /\b(lorem ipsum|placeholder|coming soon|click here|read more|your name|submit|sample text|todo|tbd|untitled|please|loading\.\.\.)\b/i;

const esiste = (rel) => fs.existsSync(path.join(RADICE, "foto", rel));
const comeLista = (v) => (Array.isArray(v) ? v : v ? [v] : []);

/* ---------- server locale ---------- */
let server, base;
before(async () => {
  const tipi = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".xml": "text/xml" };
  server = http.createServer((rich, risp) => {
    let p = decodeURIComponent(new URL(rich.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(RADICE, p);
    if (!file.startsWith(RADICE) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { risp.writeHead(404); return risp.end(); }
    risp.writeHead(200, { "Content-Type": tipi[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(risp);
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  base = "http://127.0.0.1:" + server.address().port + "/";
});
after(() => server.close());

/* ---------- 1. cani: foto, didascalie e titoli ---------- */
test("ogni cane ha nome, pedigree, sesso e una foto che esiste", () => {
  const errori = [];
  for (const c of [...CANI, ...CUCCIOLI]) {
    if (!c.nome) errori.push("cane senza nome");
    if (!c.pedigree) errori.push(c.nome + ": manca il nome da pedigree");
    if (!["F", "M"].includes(c.sesso)) errori.push(c.nome + ": sesso non valido");
    const foto = comeLista(c.foto);
    if (!foto.length) errori.push(c.nome + ": manca la foto");
    for (const f of foto) if (!esiste(f)) errori.push(c.nome + ": foto mancante foto/" + f);
  }
  assert.deepEqual(errori, []);
});

test("didascalie e titoli sono scritti e in italiano", () => {
  const errori = [];
  for (const c of [...CANI, ...CUCCIOLI]) {
    if ("didascalia" in c && !String(c.didascalia).trim()) errori.push(c.nome + ": didascalia vuota");
    for (const t of c.titoli || []) {
      if (!String(t).trim()) errori.push(c.nome + ": titolo vuoto");
      if (INGLESE.test(t)) errori.push(c.nome + ": titolo in inglese: " + t);
    }
    if (c.didascalia && INGLESE.test(c.didascalia)) errori.push(c.nome + ": didascalia in inglese");
  }
  for (const [n, e] of Object.entries(ESPOSITORI)) for (const t of e.titoli || []) if (INGLESE.test(t)) errori.push(n + ": titolo in inglese: " + t);
  for (const g of GALLERIA) {
    if (!String(g.testo || "").trim()) errori.push("galleria: didascalia mancante (" + (g.file || g.tiktok) + ")");
    else if (INGLESE.test(g.testo)) errori.push("galleria: didascalia in inglese: " + g.testo);
  }
  assert.deepEqual(errori, []);
});

/* ---------- 2. modulo di contatto ---------- */
test("il modulo contatti invia a Web3Forms con oggetto, mittente ed etichette in italiano", () => {
  const js = leggi("assets/site.js");
  const html = leggi("contatti.html");
  assert.ok(SITO.web3formsKey, "manca web3formsKey in config.js");
  assert.match(js, /fetch\("https:\/\/api\.web3forms\.com\/submit"/);
  assert.match(js, /append\("access_key", S\.web3formsKey\)/);
  const oggetto = js.match(/append\("subject", "([^"]+)"/);
  const mittente = js.match(/append\("from_name", "([^"]+)"/);
  assert.ok(oggetto && /Nuovo messaggio/.test(oggetto[1]), "oggetto non in italiano");
  assert.ok(mittente && /Sito Il Tocco della Rosa/.test(mittente[1]), "mittente non in italiano");
  const etichette = [...html.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/g)].map((m) => m[1].replace(/<[^>]+>/g, " ").trim());
  assert.ok(etichette.length >= 6, "etichette del modulo non trovate");
  const inglesi = etichette.filter((e) => /\b(name|phone|message|subject|send|your|required|yes|no)\b/i.test(e));
  assert.deepEqual(inglesi, []);
  assert.match(html, /name="botcheck"/, "manca il campo anti-spam");
});

/* ---------- 3. link e immagini ---------- */
test("tutti i link interni e le immagini rispondono 200", async () => {
  const riferimenti = new Set();
  const aggiungi = (r) => {
    r = r.trim().replace(/^https:\/\/www\.iltoccodellarosa\.it\//, "").split("#")[0].split("?")[0];
    if (!r || /^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(r)) return;
    riferimenti.add(r);
  };
  for (const p of pagine) {
    const html = leggi(p);
    for (const m of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) aggiungi(m[1]);
    for (const m of html.matchAll(/property="og:image"\s+content="([^"]*)"/g)) aggiungi(m[1]);
  }
  for (const m of leggi("assets/style.css").matchAll(/url\(["']?([^"')]+)["']?\)/g)) aggiungi("assets/" + m[1]);
  for (const m of leggi("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)) aggiungi(m[1].endsWith("/") ? m[1] + "index.html" : m[1]);
  // foto indicate nei file dei contenuti
  for (const c of [...CANI, ...CUCCIOLI]) comeLista(c.foto).forEach((f) => aggiungi("foto/" + f));
  for (const g of GALLERIA) if (g.file) aggiungi("foto/" + g.file);
  for (const f of Object.values(finestra.COPERTINE_GALLERIA || {})) aggiungi("foto/" + f);
  for (const f of Object.values(finestra.COPERTINE_CANE || {})) aggiungi("foto/" + f);
  if (SITO.copertina) aggiungi("foto/" + SITO.copertina);
  if (SITO.bannerCani) aggiungi("foto/" + SITO.bannerCani);
  for (const f of SITO.bannerFoto || []) aggiungi("foto/banner/" + f);

  const rotti = [];
  for (const r of riferimenti) {
    const risp = await fetch(base + r);
    await risp.arrayBuffer();
    if (risp.status !== 200) rotti.push(r + " → " + risp.status);
  }
  assert.ok(riferimenti.size > 20, "controllati troppo pochi riferimenti: " + riferimenti.size);
  assert.deepEqual(rotti, []);
});

/* ---------- 4. pedigree ---------- */
test("i genitori dei cani nati da noi puntano a cani che esistono", () => {
  const noti = new Set([...CANI, ...CUCCIOLI].map((c) => c.pedigree));
  for (const e of Object.values(ESPOSITORI)) noti.add(e.nome);
  const errori = [];
  for (const c of [...CANI, ...CUCCIOLI]) {
    for (const campo of ["madre", "padre"]) {
      const g = c[campo];
      if (!g) { if (/Nat[oa] da noi/.test(c.origine || "")) errori.push(c.nome + ": manca " + campo); continue; }
      // controllo solo i genitori "di casa" (il cui nome comincia con l'affisso) e quelli dei cuccioli: gli altri sono cani di altri allevamenti
      const diCasa = /^Il Tocco della Rosa/.test(g) || CUCCIOLI.includes(c);
      if (diCasa && !noti.has(g)) errori.push(c.nome + ": " + campo + " '" + g + "' non è tra i cani del sito");
    }
  }
  assert.deepEqual(errori, []);
});

/* ---------- 5. niente segnaposto in inglese ---------- */
test("nessun testo segnaposto in inglese nelle pagine", () => {
  const trovati = [];
  for (const p of pagine) {
    const html = leggi(p);
    const visibile = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ");
    const attributi = [...html.matchAll(/\b(?:alt|title|placeholder|aria-label)="([^"]*)"/g)].map((m) => m[1]);
    for (const testo of [visibile, ...attributi]) {
      const m = testo.match(INGLESE);
      if (m) trovati.push(p + ": '" + m[0] + "'");
    }
    if (/segnaposto/i.test(visibile)) trovati.push(p + ": riquadro 'segnaposto' ancora presente");
  }
  assert.deepEqual(trovati, []);
});
