# Il Tocco della Rosa – sito web

Sito dell'allevamento di Chihuahua **Il Tocco della Rosa**, pubblicato con GitHub Pages su **www.iltoccodellarosa.it**.
È un sito statico (solo HTML, CSS e un po' di JavaScript): niente da installare, niente da compilare. GitHub lo tiene online 24 ore su 24, gratis, anche con il PC spento.

## Cosa modificare e dove

| Cosa | File |
|---|---|
| Numero WhatsApp, email, zona, chiave del modulo, foto di copertina | `assets/config.js` |
| Cani, cuccioli disponibili, foto della galleria | `assets/dati.js` |
| Foto | cartella `foto/` |
| Testi delle pagine | i file `.html` (cerca i riquadri tratteggiati "segnaposto" e sostituiscili) |

Le modifiche si possono fare direttamente da github.com: apri il file, clicca la matita ✏️, modifica e premi **Commit changes**. Dopo un minuto il sito è aggiornato.

**Aggiungere una foto:** nella cartella `foto/` clicca **Add file → Upload files**, carica la foto (JPG, lato lungo circa 1600 px), poi scrivi il nome del file in `assets/dati.js` (campo `foto` del cane, oppure una nuova riga in `GALLERIA`).

**Pubblicare un cucciolo:** aggiungi una riga in `CUCCIOLI` dentro `assets/dati.js` (c'è un esempio già scritto). Quando la lista è vuota il sito mostra in automatico il messaggio della lista d'attesa.

## Mettere il sito in manutenzione

In `assets/config.js` cambia `manutenzione: false` in `manutenzione: true` e salva: dopo circa un minuto tutte le pagine mostrano solo l'avviso "Sito in manutenzione" con il pulsante WhatsApp. Per riaprire il sito rimetti `false`.

## Modulo di contatto (Web3Forms)

1. Vai su <https://web3forms.com>, inserisci l'email dove vuoi ricevere i messaggi e premi **Create Access Key**.
2. Ti arriva per email una chiave (una serie di lettere e numeri).
3. Incollala in `assets/config.js`, nel campo `web3formsKey`.

Il servizio è gratuito fino a 250 messaggi al mese. Finché la chiave non c'è, il modulo apre WhatsApp con il messaggio già scritto.

## Mettere online il sito (una volta sola)

1. Su GitHub apri il repository → **Settings → Pages**.
2. In **Build and deployment** scegli **Deploy from a branch**, branch **main**, cartella **/ (root)**, poi **Save**.
3. In **Custom domain** deve comparire `www.iltoccodellarosa.it` (lo legge dal file `CNAME`). Quando il DNS è pronto, spunta **Enforce HTTPS**.

## Puntare il dominio (dal pannello del tuo registrar)

Nella gestione DNS del dominio `iltoccodellarosa.it` crea questi record (cancella eventuali record A o CNAME vecchi sugli stessi nomi):

| Tipo | Nome | Valore |
|---|---|---|
| CNAME | `www` | `roby75.github.io` |
| A | `@` (dominio senza www) | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

I record A servono perché anche chi scrive `iltoccodellarosa.it` senza www arrivi al sito. La propagazione richiede da pochi minuti a qualche ora; il certificato HTTPS lo crea GitHub da solo.
