# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cos'è

Sito statico dell'allevamento di Chihuahua **Il Tocco della Rosa** (www.iltoccodellarosa.it), servito da GitHub Pages direttamente dal ramo `main`, cartella root (`CNAME`, `.nojekyll`). Niente build, niente dipendenze, niente `package.json`: solo HTML, CSS e JavaScript vanilla (ES5, IIFE). Tutto il sito, il codice e i messaggi di commit sono in italiano. Il proprietario modifica spesso i file direttamente da github.com o da telefono.

## Comandi

```bash
node --test tests/sito.test.mjs        # tutti i test (Node ≥ 22, nessuna installazione)
node --test --test-name-pattern="pedigree" tests/sito.test.mjs   # un solo test
node strumenti/pubblica.mjs            # controlla cosa c'è da pubblicare e lancia i test, NON pubblica
node strumenti/pubblica.mjs --ok --messaggio "…"   # test → voce in CHANGELOG.md → commit → push su main
python3 -m http.server                 # anteprima locale (qualsiasi server statico va bene)
```

Nota: il commento in testa al file di test dice `node --test tests/`, ma con Node 22 fallisce (lo tratta come modulo); usare il percorso del file.

Pubblicare = fare push su `main`: il sito online cambia dopo circa un minuto. `pubblica.mjs` si rifiuta se non si è su `main`, se `origin/main` ha commit che mancano in locale, o se un test fallisce, e senza `--ok` non pubblica mai. Aggiunge da sé la voce `## vN – gg/mm/aaaa` in `CHANGELOG.md` (non scriverla a mano) e alla fine elenca le pagine da ricontrollare online. Non pubblicare senza l'ok esplicito del proprietario.

## Architettura

**Contenuti separati dal codice.** Il proprietario modifica solo due file di dati, caricati come script globali prima di `site.js`:
- `assets/config.js` → `window.SITO`: WhatsApp, email, zona, chiave Web3Forms, `sheetUrl` (Google Apps Script che copia le richieste del modulo in uno Sheet), copertina, foto del banner (`bannerFoto`, `bannerCentro`), social, e il flag `manutenzione`.
- `assets/dati.js` → `window.CANI`, `CUCCIOLI`, `GALLERIA`, `COPERTINE_GALLERIA`, `COPERTINE_CANE`, `ESPOSITORI`, `ESPOSITORI_ORDINE`. I percorsi delle foto sono relativi a `foto/`; `foto` di un cane può essere una stringa o un array. Mantenere i commenti esplicativi in testa a questi file: sono le istruzioni per il proprietario.

**`assets/site.js`** è un'unica IIFE che fa tutto il rendering lato client, attivandosi in base a cosa trova nella pagina:
- attributi `data-*` (`data-wa`, `data-wa-numero`, `data-email`, `data-zona`, `data-instagram`, `data-banner-cani`, `data-copertina`, `data-anno`, `data-rotazione`) riempiti con i valori di `SITO`;
- contenitori per id: `griglia-cani`/`griglia-veterani` (cani.html, con filtri `data-filtro`), `griglia-cuccioli`/`nessun-cucciolo` (cuccioli.html; lista vuota → messaggio lista d'attesa), `galleria` (sezioni, raggruppamento per `cane`/`evento` nelle Esposizioni, lightbox), `modulo-contatti` (POST a Web3Forms + copia su `sheetUrl`; senza chiave ripiega su WhatsApp; `contatti.html?modulo` mostra solo il modulo);
- `manutenzione: true` reindirizza ogni pagina a `manutenzione.html` (e viceversa quando è `false`).
Tutto ciò che viene da `dati.js` passa per `esc()` prima di finire in `innerHTML`.

**Pagine HTML.** Ogni pagina ripete a mano `<head>` (meta SEO/OG, canonical), header con menu e footer: una modifica al menu o al footer va fatta in tutti i file `.html`. Le pagine che mostrano dati includono `config.js`, `dati.js`, `site.js` in quest'ordine; le altre solo `config.js` e `site.js`. Una pagina nuova va aggiunta anche a `sitemap.xml`. `googlef9e39cef1f3a619b.html` è la verifica di Google Search Console: non toccarla.

## Cosa controllano i test (`tests/sito.test.mjs`)

Caricano `config.js` + `dati.js` in una `vm` e servono il sito su un server HTTP locale. Falliscono se:
- un cane/cucciolo non ha `nome`, `pedigree`, `sesso` valido o una foto esistente in `foto/`;
- in pagine, didascalie o titoli compaiono parole inglesi da segnaposto (regex `INGLESE`) o la parola "segnaposto";
- un link interno, un'immagine, un `url()` del CSS, una voce della sitemap o una foto citata nei dati non risponde 200;
- un genitore con affisso "Il Tocco della Rosa" (o qualsiasi genitore di un cucciolo) non corrisponde al `pedigree` di un cane in `CANI`/`CUCCIOLI` o al `nome` di un `ESPOSITORI`; i cani con origine "Nato/a da noi" devono avere madre e padre;
- il modulo contatti perde la chiave Web3Forms, l'oggetto/mittente in italiano, le etichette in italiano o il campo anti-spam `botcheck`.

## Foto

JPG o WEBP, lato lungo circa 1600 px, possibilmente sotto i 400 KB (`foto/LEGGIMI.txt`). Sottocartelle per tipo: `cani/`, `cuccioli/`, `galleria/`, `esposizioni/<cane>/`, `banner/`, `chi-siamo/`.
