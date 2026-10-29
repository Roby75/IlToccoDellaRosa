/* =========================================================
   CONTENUTI AGGIORNABILI: cani, cuccioli, galleria.
   Per aggiungere una foto: caricala nella cartella "foto/" e scrivi qui il nome del file.
   ========================================================= */

/* I NOSTRI CANI
   sesso: "F" o "M" · pelo: "PL" (pelo lungo) o "PC" (pelo corto)
   foto: nome del file nella cartella foto/ (lascia "" finché non c'è)
   test: test sanitari, es. test: [{ nome: "Lussazione rotulea", esito: "0/0" }] (togli il campo se non ci sono)
   pedigree: nome completo da pedigree (per i cani nati da noi)
   veterano: true = compare anche nella sezione "I Nostri Veterani"
   dna: true se il DNA è depositato in ENCI (togli il campo se no) */
window.CANI = [
  // Fattrici
  { nome: "Bia", pedigree: "Il Tocco della Rosa Bia la Sfida della Magia",     sesso: "F", nascita: "2025", pelo: "PL", colore: "Fulva chiara",  madre: "Avada Kedavra Uma Thurman",    padre: "Il Tocco della Rosa Gino",    origine: "Nata da noi", foto: "cani/bia.jpg" },
  { nome: "Klara", pedigree: "Il Tocco della Rosa Klara",   sesso: "F", nascita: "2024", pelo: "PL", colore: "Crema",         madre: "Avada Kedavra Magic Moment", padre: "Amazing Dream Pride of Legolas", origine: "Nata da noi", foto: "cani/klara.jpg", dna: true, test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Leda", pedigree: "Maison Magic Diamond Rosina",    sesso: "F", nascita: "2025", pelo: "PL", colore: "Crema",         madre: "Magic Diamond Lady", padre: "Inventor Dragon", origine: "Allevamento italiano", foto: "", test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Lia", pedigree: "Love Story Dogydotchi",     sesso: "F", nascita: "2023", pelo: "PL", colore: "Nero tricolor", madre: "Breakfast at Tiffany's Dogydotchi", padre: "Benrich's Inspire to Love", origine: "Dogydotchi", foto: "cani/lia.jpg", test: [{ nome: "Lussazione rotulea", esito: "0/1" }] },
  { nome: "Linda", pedigree: "Lind Rose",   sesso: "F", nascita: "2021", pelo: "PL", colore: "Crema",         madre: "Avada Kedavra Magic Moment", padre: "Wizard Desire for Love Chihua in Ukraine",  origine: "Nata da noi", foto: "", dna: true, test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Liz", pedigree: "Liz Taylor del Pasador",     sesso: "F", nascita: "2023", pelo: "PC", colore: "Sabbia",        madre: "Evelyn del Pasador", padre: "Ciko del Pasador", origine: "del Pasador", foto: "cani/liz.jpg" },
  { nome: "Melody", veterano: true, pedigree: "Avada Kedavra Magic Moment",  sesso: "F", nascita: "2018", pelo: "PL", colore: "Crema",         madre: "Beso de Dios Zelena the Black Witch Avada Kedavra", padre: "Rebecca Rose Serse", origine: "Avada Kedavra", foto: "", dna: true, nota: "Una delle nostre prime fattrici: oggi è in pensione e resta in famiglia con noi." },
  { nome: "Olivia", pedigree: "Il Tocco della Rosa Olivia",  sesso: "F", nascita: "2025", pelo: "PC", colore: "Fulva",         madre: "Liz Taylor del Pasador",    padre: "Il Tocco della Rosa Gino",    origine: "Nata da noi", foto: "cani/olivia.jpg" },
  // Stalloni
  { nome: "King", pedigree: "Il Tocco della Rosa B.B. King",    sesso: "M", nascita: "2025", pelo: "PL", colore: "Tricolore",     madre: "Il Tocco della Rosa Klara",  padre: "Kotaro Dogydotchi",  origine: "Nato da noi", foto: "", dna: true, test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Kotaro", veterano: true, pedigree: "Kotaro Dogydotchi",  sesso: "M", nascita: "2018", pelo: "PL", colore: "Nero tricolor", madre: "Little Prince's Beautiful Song \"Akiko\"", padre: "Benrich's Inspire to Love", origine: "Dogydotchi", foto: "", dna: true },
  { nome: "Legolas", pedigree: "Amazing Dream Pride of Legolas", sesso: "M", nascita: "2021", pelo: "PL", colore: "Crema",         madre: "Amazing Dream Keeping It Special", padre: "Amazing Dream Victorius Legolas", origine: "Amazing Dream (Norvegia)", foto: "cani/legolas.jpg", test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Mario", pedigree: "Xavier Radostnii Angelgrad",   sesso: "M", nascita: "2025", pelo: "PL", colore: "",              madre: "Honey Nika Radostnii Angelgrad", padre: "Shah Arpilin Simon", origine: "Radostnii Angelgrad (Moldavia)", foto: "", dna: true, test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Show", pedigree: "The Greatest Showman La Casa dei Giganti",    sesso: "M", nascita: "2021", pelo: "PC", colore: "Crema",         madre: "The Cisco Miss La Casa dei Giganti", padre: "Al Capone La Casa dei Giganti", origine: "La Casa dei Giganti", foto: "cani/show.jpg", dna: true, test: [{ nome: "Lussazione rotulea", esito: "0/0" }] },
  { nome: "Wizard", veterano: true, pedigree: "Wizard Desire for Love Chihua in Ukraine",  sesso: "M", nascita: "2018", pelo: "PL", colore: "Crema",         madre: "Malena Chihua in Ukraine", padre: "Voxel UX Naruto", origine: "Chihua in Ukraine (Ucraina)", foto: "cani/wizard.jpg"}
];

/* CUCCIOLI DISPONIBILI
   Quando hai cuccioli da proporre, aggiungi una riga per ciascuno, per esempio:
   { nome: "Rosa", sesso: "F", nascita: "10/01/2027", pelo: "PL", colore: "Crema", madre: "Klara", padre: "King", stato: "Disponibile", foto: "rosa.jpg" },
   stato: "Disponibile" oppure "Prenotato". Se la lista è vuota il sito mostra il messaggio della lista d'attesa. */
window.CUCCIOLI = [];

/* GALLERIA
   Per ogni foto: file (nella cartella foto/) e una breve didascalia.
   Per un video TikTok: tiktok (numero del video) e sezione (es. "Vita in allevamento").
   Le sezioni ancora senza contenuti mostrano "Foto in arrivo". */
window.COPERTINE_GALLERIA = {
  "Vita in allevamento": "galleria/rosa-prato-2.jpg",
  "Esposizioni e ricordi": "galleria/esposizione-royal-canin.jpg",
};
window.GALLERIA = [
  // { file: "klara-prato.jpg", testo: "Klara in giardino" },
  { tiktok: "7700182101085343009", sezione: "Vita in allevamento", testo: "Vita in allevamento" },
  { file: "galleria/rosa-prato-2.jpg", sezione: "Vita in allevamento", testo: "In giardino con i cuccioli" },
  { file: "galleria/rosa-prato-1.jpg", sezione: "Vita in allevamento", testo: "Coccole sul prato" },
  { file: "galleria/esposizione-royal-canin.jpg", sezione: "Esposizioni e ricordi", testo: "In esposizione" },
];
