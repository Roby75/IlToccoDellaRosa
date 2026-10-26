/* Il Tocco della Rosa — script del sito. Non serve modificarlo:
   i contenuti si cambiano in config.js e dati.js. */
(function () {
  var S = window.SITO || {};

  /* modalità manutenzione: tutte le pagine portano a manutenzione.html, e viceversa quando è spenta */
  var inManutenzione = /manutenzione\.html$/.test(location.pathname);
  if (S.manutenzione && !inManutenzione) { location.replace("manutenzione.html"); return; }
  if (!S.manutenzione && inManutenzione) { location.replace("index.html"); return; }
  var ICONA_ROSA = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M24 30c-7 0-11-5-11-11 4 0 7 1 9 3 0-5 1-9 2-12 1 3 2 7 2 12 2-2 5-3 9-3 0 6-4 11-11 11Z"/><path d="M24 30v12M24 38c-3-3-6-4-9-4M24 36c2-2 5-3 8-3"/></svg>';

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function waLink(testo) { return S.whatsapp ? "https://wa.me/" + S.whatsapp + (testo ? "?text=" + encodeURIComponent(testo) : "") : ""; }
  function segnaposto(t) { return '<span class="segnaposto">' + esc(t) + "</span>"; }

  /* menu da telefono */
  var btn = document.querySelector(".menu-btn"), nav = document.querySelector("nav.principale");
  if (btn && nav) btn.addEventListener("click", function () {
    var aperto = nav.classList.toggle("aperto");
    btn.setAttribute("aria-expanded", aperto ? "true" : "false");
  });

  /* recapiti presi da config.js */
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var l = waLink(a.getAttribute("data-wa"));
    if (l) { a.href = l; a.target = "_blank"; a.rel = "noopener"; }
    else if (a.classList.contains("wa-fisso")) a.hidden = true;
    else a.href = "contatti.html";
  });
  document.querySelectorAll("[data-wa-numero]").forEach(function (el) {
    el.innerHTML = S.whatsappVisibile ? esc(S.whatsappVisibile) : segnaposto("Numero WhatsApp da inserire");
  });
  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.innerHTML = S.email ? '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a>" : segnaposto("Email da inserire");
  });
  document.querySelectorAll("[data-zona]").forEach(function (el) {
    el.innerHTML = S.zona ? esc(S.zona) : segnaposto("Zona da inserire");
  });
  document.querySelectorAll("[data-copertina]").forEach(function (el) {
    if (S.copertina) el.innerHTML = '<div class="petalo"><img src="foto/' + esc(S.copertina) + '" alt="Chihuahua dell\'allevamento Il Tocco della Rosa"></div>';
  });
  document.querySelectorAll("[data-anno]").forEach(function (el) { el.textContent = new Date().getFullYear(); });


  /* animazioni: alone e petali che seguono il mouse, schede che si inclinano, sezioni che entrano */
  var movimento = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var ap = document.querySelector("main > section:first-child");
  if (ap && movimento) {
    ap.classList.add("con-petali");
    var alone = document.createElement("div"); alone.className = "alone"; ap.prepend(alone);
    var petali = document.createElement("div"); petali.className = "petali"; petali.setAttribute("aria-hidden", "true");
    var quanti = mouse ? 18 : 9;
    for (var i = 0; i < quanti; i++) {
      var p = document.createElement("span");
      p.appendChild(document.createElement("i"));
      p.style.left = (Math.random() * 100) + "%";
      p.style.setProperty("--s", (10 + Math.random() * 16) + "px");
      p.style.setProperty("--d", (12 + Math.random() * 12) + "s");
      p.style.animationDelay = (-Math.random() * 24) + "s";
      p.dataset.k = (0.3 + Math.random()).toFixed(2);
      petali.appendChild(p);
    }
    ap.prepend(petali);
    var altezza = function () { petali.style.setProperty("--h", (ap.offsetHeight + 40) + "px"); };
    altezza(); window.addEventListener("resize", altezza);
    if (mouse) ap.addEventListener("pointermove", function (e) {
      var r = ap.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      ap.style.setProperty("--mx", x + "px"); ap.style.setProperty("--my", y + "px");
      var dx = (x / r.width - .5) * 60, dy = (y / r.height - .5) * 60;
      petali.querySelectorAll("span").forEach(function (s) {
        s.style.setProperty("--px", (-dx * s.dataset.k) + "px"); s.style.setProperty("--py", (-dy * s.dataset.k) + "px");
      });
    });
  }
  function inclina(el) {
    el.classList.add("inclina");
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var rx = ((e.clientY - r.top) / r.height - .5) * -7, ry = ((e.clientX - r.left) / r.width - .5) * 7;
      el.style.transform = "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
    });
    el.addEventListener("pointerleave", function () { el.style.transform = ""; });
  }
  function animaSchede() {
    if (movimento && mouse) document.querySelectorAll(".cane:not(.inclina), .apertura .petalo:not(.inclina), .riquadro:not(.inclina), form.modulo:not(.inclina)").forEach(function (el) {
      if (el.matches("form.modulo")) return; inclina(el);
    });
  }
  window.animaSchede = animaSchede;
  if (movimento && "IntersectionObserver" in window) {
    var oss = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add("vista"); oss.unobserve(v.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".sezione .intestazione, .punto, .tempo li, .duo > *, .persona").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) return; /* ciò che si vede già all'apertura resta fermo */
      el.classList.add("entra"); oss.observe(el);
    });
  }


  /* dissolvenza in uscita quando si va su un'altra pagina del sito */
  if (movimento) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      document.documentElement.classList.add("in-uscita");
      setTimeout(function () { location.href = url.href; }, 180);
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) document.documentElement.classList.remove("in-uscita"); });
  }

  /* scheda di un cane o cucciolo */
  function foto(file, alt) {
    if (file) return '<div class="petalo"><img src="foto/' + esc(file) + '" alt="' + esc(alt) + '" loading="lazy"></div>';
    return '<div class="petalo foto-vuota"><div>' + ICONA_ROSA + "Foto in arrivo</div></div>";
  }
  function scheda(c, cucciolo) {
    var pelo = c.pelo === "PC" ? "Pelo corto" : c.pelo === "PL" ? "Pelo lungo" : "";
    var sesso = c.sesso === "F" ? (cucciolo ? "Femmina" : "Fattrice") : (cucciolo ? "Maschio" : "Stallone");
    var righe = "";
    if (c.colore) righe += "<dt>Colore</dt><dd>" + esc(c.colore) + "</dd>";
    righe += "<dt>" + (cucciolo ? "Nato il" : "Nascita") + "</dt><dd>" + esc(c.nascita) + "</dd>";
    if (c.madre || c.padre) righe += "<dt>Genitori</dt><dd>" + esc(c.madre) + " × " + esc(c.padre) + "</dd>";
    if (c.origine) righe += "<dt>Origine</dt><dd>" + esc(c.origine) + "</dd>";
    if (c.test && c.test.length) righe += "<dt>Test sanitari</dt><dd>" + c.test.map(function (t) { return esc(t.nome) + ": <strong>" + esc(t.esito) + "</strong>"; }).join("<br>") + "</dd>";
    var stato = c.stato ? '<span class="etichetta ' + (c.stato === "Disponibile" ? "m" : "") + '">' + esc(c.stato) + "</span>" : "";
    return '<article class="cane">' + foto(c.foto, c.nome) +
      '<div class="corpo"><div class="etichette"><span class="etichetta ' + (c.sesso === "F" ? "f" : "m") + '">' + sesso + "</span>" +
      (pelo ? '<span class="etichetta">' + pelo + "</span>" : "") + stato + "</div>" +
      "<h3>" + esc(c.nome || "Cucciolo") + "</h3><dl>" + righe + "</dl>" +
      (c.nota ? '<p class="nota">' + esc(c.nota) + "</p>" : "") +
      (cucciolo && c.stato === "Disponibile" ? '<a class="btn wa" data-wa href="' + (waLink("Ciao, vorrei informazioni sul cucciolo " + (c.nome || "") + " (" + c.madre + " × " + c.padre + ")") || "contatti.html") + '" target="_blank" rel="noopener">Chiedi informazioni</a>' : "") +
      "</div></article>";
  }

  /* pagina I nostri cani */
  var gCani = document.getElementById("griglia-cani");
  if (gCani) {
    var filtro = "tutti";
    var disegna = function () {
      var lista = (window.CANI || []).filter(function (c) {
        return filtro === "tutti" || filtro === c.sesso || filtro === c.pelo;
      });
      gCani.innerHTML = lista.map(function (c) { return scheda(c, false); }).join("") || '<p class="muted">Nessun cane per questo filtro.</p>';
      animaSchede();
    };
    document.querySelectorAll(".filtri button").forEach(function (b) {
      b.addEventListener("click", function () {
        filtro = b.getAttribute("data-filtro");
        document.querySelectorAll(".filtri button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        disegna();
      });
    });
    disegna();
  }

  /* pagina Cuccioli */
  var gCuc = document.getElementById("griglia-cuccioli");
  if (gCuc) {
    var cuc = window.CUCCIOLI || [];
    if (cuc.length) {
      gCuc.innerHTML = cuc.map(function (c) { return scheda(c, true); }).join("");
      var vuoto = document.getElementById("nessun-cucciolo");
      if (vuoto) vuoto.hidden = true;
    } else gCuc.hidden = true;
  }

  /* galleria */
  var gal = document.getElementById("galleria");
  if (gal) {
    var foto_ = window.GALLERIA || [];
    if (foto_.length) {
      gal.innerHTML = foto_.map(function (f, i) {
        return '<figure><button type="button" data-i="' + i + '" aria-label="Ingrandisci: ' + esc(f.testo) + '"><div class="petalo"><img src="foto/' + esc(f.file) + '" alt="' + esc(f.testo) + '" loading="lazy"></div></button>' +
          (f.testo ? "<figcaption>" + esc(f.testo) + "</figcaption>" : "") + "</figure>";
      }).join("");
      gal.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-i]"); if (!b) return;
        var f = foto_[+b.getAttribute("data-i")];
        var box = document.createElement("div");
        box.className = "lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", f.testo || "Foto");
        box.innerHTML = '<button type="button">Chiudi</button><figure style="margin:0"><img src="foto/' + esc(f.file) + '" alt="' + esc(f.testo) + '"><p>' + esc(f.testo) + "</p></figure>";
        var chiudi = function () { box.remove(); document.removeEventListener("keydown", tasto); b.focus(); };
        var tasto = function (ev) { if (ev.key === "Escape") chiudi(); };
        box.addEventListener("click", function (ev) { if (ev.target === box || ev.target.tagName === "BUTTON") chiudi(); });
        document.addEventListener("keydown", tasto);
        document.body.appendChild(box); box.querySelector("button").focus();
      });
    } else {
      var segn = "";
      ["Le nostre fattrici", "Gli stalloni", "Cuccioli in crescita", "Vita in allevamento", "Le famiglie dei nostri cuccioli", "Esposizioni e ricordi"].forEach(function (t) {
        segn += '<figure><div class="petalo foto-vuota"><div>' + ICONA_ROSA + "Foto in arrivo</div></div><figcaption>" + t + "</figcaption></figure>";
      });
      gal.innerHTML = segn;
    }
  }

  /* modulo contatti */
  var form = document.getElementById("modulo-contatti");
  if (form) {
    var esito = document.getElementById("esito");
    var mostra = function (tipo, testo) { esito.className = "esito " + tipo; esito.textContent = testo; esito.hidden = false; };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      if (d.get("botcheck")) return;
      var riepilogo = "Nome: " + d.get("nome") + "\nTelefono: " + (d.get("telefono") || "-") + "\nEmail: " + d.get("email") +
        "\nInteresse: " + (d.get("interesse") || "-") + "\nPelo preferito: " + (d.get("pelo") || "indifferente") + "\n\n" + d.get("messaggio");
      if (!S.web3formsKey) {
        var l = waLink("Ciao, vi scrivo dal sito.\n\n" + riepilogo);
        if (l) { window.open(l, "_blank", "noopener"); mostra("ok", "Ti abbiamo aperto WhatsApp con il messaggio già scritto: premi Invia per mandarcelo."); }
        else mostra("errore", "Il modulo non è ancora attivo. Nel frattempo scrivici su WhatsApp o su Facebook.");
        return;
      }
      d.append("access_key", S.web3formsKey);
      d.append("subject", "Nuovo messaggio dal sito – " + d.get("nome"));
      d.append("from_name", "Sito Il Tocco della Rosa");
      var invia = form.querySelector("button[type=submit]");
      invia.disabled = true; invia.textContent = "Invio in corso…";
      fetch("https://api.web3forms.com/submit", { method: "POST", body: d })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.success) { form.reset(); mostra("ok", "Grazie! Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto."); }
          else throw new Error(j.message);
        })
        .catch(function () { mostra("errore", "L'invio non è riuscito. Riprova tra poco oppure scrivici su WhatsApp."); })
        .then(function () { invia.disabled = false; invia.textContent = "Invia il messaggio"; });
    });
  }
  animaSchede();
})();
