/* =========================================================
   CONTENUTI AGGIORNABILI: cani, cuccioli, galleria.
   Per aggiungere una foto: caricala nella cartella "foto/" e scrivi qui il nome del file.
   ========================================================= */

/* I NOSTRI CANI
   sesso: "F" o "M" · pelo: "PL" (pelo lungo) o "PC" (pelo corto)
   foto: nome del file nella cartella foto/ (lascia "" finché non c'è)
   test: test sanitari, es. test: [{ nome: "Lussazione rotulea", esito: "0/0" }] (togli il campo se non ci sono)
   dna: true se il DNA è depositato in ENCI (togli il campo se no) */
window.CANI = [
  // Fattrici
  { nome: "Bia",     sesso: "F", nascita: "2025", pelo: "PL", colore: "Fulva chiara",  madre: "Uma",    padre: "Gino",    origine: "Nata da noi", foto: "" },
  { nome: "Klara",   sesso: "F", nascita: "2024", pelo: "PL", colore: "Crema",         madre: "Melody", padre: "Legolas", origine: "Nata da noi", foto: "", dna: true, test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Leda",    sesso: "F", nascita: "2025", pelo: "PL", colore: "Crema",         madre: "Magic Diamond Lady", padre: "Inventor Dragon", origine: "Allevamento italiano", foto: "", test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Lia",     sesso: "F", nascita: "2023", pelo: "PL", colore: "Nero tricolor", madre: "Breakfast at Tiffany's", padre: "Benrich's Inspire to Love", origine: "Dogydotchi", foto: "", test: [{ nome: "Lussazione rotulea", esito: "0/1" }] },
  { nome: "Linda",   sesso: "F", nascita: "2021", pelo: "PL", colore: "Crema",         madre: "Melody", padre: "Wizard",  origine: "Nata da noi", foto: "", dna: true, test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Liz",     sesso: "F", nascita: "2023", pelo: "PC", colore: "Sabbia",        madre: "Evelyn del Pasador", padre: "Ciko del Pasador", origine: "del Pasador", foto: "" },
  { nome: "Melody",  sesso: "F", nascita: "2018", pelo: "PL", colore: "Crema",         madre: "Beso de Dios Zelena the Black Witch", padre: "Rebecca Rose Serse", origine: "Avada Kedavra", foto: "", dna: true, nota: "Una delle nostre prime fattrici: oggi è in pensione e resta in famiglia con noi." },
  { nome: "Olivia",  sesso: "F", nascita: "2025", pelo: "PC", colore: "Fulva",         madre: "Liz",    padre: "Gino",    origine: "Nata da noi", foto: "" },
  // Stalloni
  { nome: "King",    sesso: "M", nascita: "2025", pelo: "PL", colore: "Tricolore",     madre: "Klara",  padre: "Kotaro",  origine: "Nato da noi", foto: "", dna: true, test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Kotaro",  sesso: "M", nascita: "2018", pelo: "PL", colore: "Nero tricolor", madre: "Little Prince's Beautiful Song", padre: "Benrich's Inspire to Love", origine: "Dogydotchi", foto: "", dna: true },
  { nome: "Legolas", sesso: "M", nascita: "2021", pelo: "PL", colore: "Crema",         madre: "Amazing Dream Keeping It Special", padre: "Amazing Dream Victorius Legolas", origine: "Amazing Dream (Norvegia)", foto: "", test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Mario",   sesso: "M", nascita: "2025", pelo: "PL", colore: "",              madre: "Honey Nika", padre: "Shah Arpilin Simon", origine: "Radostnii Angelgrad (Moldavia)", foto: "", dna: true, test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Show",    sesso: "M", nascita: "2021", pelo: "PC", colore: "Crema",         madre: "The Cisco Miss", padre: "Al Capone", origine: "La Casa dei Giganti", foto: "", dna: true, test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Wizard",  sesso: "M", nascita: "2018", pelo: "PL", colore: "Crema",         madre: "Malena Chihua in Ukraine", padre: "Voxel UX Naruto", origine: "Chihua in Ukraine (Ucraina)", foto: "" }
];

/* CUCCIOLI DISPONIBILI
   Quando hai cuccioli da proporre, aggiungi una riga per ciascuno, per esempio:
   { nome: "Rosa", sesso: "F", nascita: "10/01/2027", pelo: "PL", colore: "Crema", madre: "Klara", padre: "King", stato: "Disponibile", foto: "rosa.jpg" },
   stato: "Disponibile" oppure "Prenotato". Se la lista è vuota il sito mostra il messaggio della lista d'attesa. */
window.CUCCIOLI = [];

/* GALLERIA
   Per ogni foto: file (nella cartella foto/) e una breve didascalia. */
window.GALLERIA = [
  // { file: "klara-prato.jpg", testo: "Klara in giardino" },
];
