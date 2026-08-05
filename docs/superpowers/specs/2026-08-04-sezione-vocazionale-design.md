# Sezione vocazionale: accorpamento in mdv-webapp e pilota del nuovo sistema visivo

**Data:** 2026-08-04
**Stato:** Design approvato — in attesa di review della spec
**Repo coinvolti:** `mdv-webapp` (Vue), `mdv-vocational` (React, da dismettere)

---

## 1. Contesto e problema

La comunità mantiene oggi due siti separati. `mdv-vocational` è una Create React App del 2020 (React 16, Bootstrap 4, `react-scripts` 3): 15 rotte, ~92 KB di markdown, ferma a due commit. Non è aggiornabile in modo sensato e nessuno ci mette mano.

In parallelo, `mdv-webapp` ha già una pagina `/vocazione`: un header e tre paragrafi, presenti in tutte e sei le lingue.

Esiste un documento redazionale nuovo — *"Nuovo sito vocazionale"* — che riscrive integralmente il contenuto vocazionale in forma adatta al web. È la specifica di contenuto di questo lavoro.

C'è però un secondo problema, indipendente ma che condiziona l'esecuzione: **le decisioni visive del sito non hanno un posto in cui essere prese una volta sola**.

```
29 file .vue  →  29 hanno il proprio <style>
CSS centrale  →  nessuno
Design token  →  nessuno
"Playfair Display"  ripetuto in 14 file
"#8c681c"           ripetuto in  8 file
```

Con questa struttura, qualunque rinnovamento dell'interfaccia significa rimettere mano ovunque, e ogni parte nuova costruita oggi andrà rifatta domani.

## 2. Obiettivo

Portare la sezione vocazionale dentro `mdv-webapp` seguendo il documento redazionale, e usarla come **pilota del sistema visivo e delle convenzioni** che il resto del sito adotterà in seguito.

Esito atteso:

- Un solo sito da mantenere; `mdv-vocational` dismesso.
- La sezione vocazionale nasce già sul nuovo sistema e **non viene rifatta** quando il resto del sito verrà rinnovato.
- Esistono regole scritte e verificabili che impediscono alla duplicazione di riformarsi.

### Principio guida

Lo stile resta **semplice ed essenziale**, coerente con la radicalità e la povertà dei Missionari della Via. "Moderno" qui significa respiro, gerarchia e ritmo tipografico — non effetti. La palette bruno/oro e i serif attuali sono già coerenti con questo: il problema non sono i colori, è la densità.

## 3. Decomposizione

Il lavoro è stato scomposto in tre fasi. **Questa spec copre le fasi 1 e 2.** La fase 3 avrà la propria spec.

| Fase | Contenuto | Copertura |
|------|-----------|-----------|
| 1 | Token centrali + chrome condiviso (navbar, footer, `ui/Base*`) | questa spec |
| 2 | Sezione vocazionale | questa spec |
| 3 | Le 6 pagine esistenti: migrazione ai token + restyling, in un solo passaggio | spec successiva |

Le fasi 1 e 2 stanno insieme perché la fase 1 da sola (~4 file, zero cambiamento visibile) non è un progetto a sé: è il prerequisito della fase 2.

**Perché fondamenta minime e non migrazione completa.** Migrare subito tutti i 29 file significherebbe toccare ogni pagina esistente due volte: una per i token, una per il restyling. Rimandando le 6 pagine alla fase 3, ciascuna viene toccata **una volta sola**, facendo entrambe le cose insieme.

**Costo accettato:** durante la fase 3 il sito ha due estetiche che convivono. Se la sezione vocazionale viene pubblicata prima che la fase 3 sia completa, la differenza si vede.

## 4. Scope

### In scope

- Rotte, view e componenti della sezione vocazionale.
- Contenuto in `src/assets/data/vocazione.json`, **solo italiano**, tratto dal documento redazionale.
- Recupero delle testimonianze già esistenti in `mdv-vocational`, incluse le immagini.
- `src/assets/css/tokens.css` e migrazione di `MdvNavbar`, `MdvFooter`, `src/components/ui/Base*`.
- Le quattro regole di convenzione (§7) e i test che ne verificano una parte.

### Fuori scope

- **Traduzione della sezione in altre lingue.** La sezione è italiana. Vedi §6 per il comportamento nelle altre lingue.
- **Restyling delle 6 pagine esistenti** — fase 3.
- **Framework di test per componenti.** Decisione più ampia di questa feature, da prendere a parte. Conseguenza dichiarata: il rendering dei componenti non è coperto da test.
- **Regressione visiva automatica.** Non esiste infrastruttura; la verifica della fase 1 è manuale.
- **Le sezioni che il documento non prevede:** `/vocazioni-famose`, `/vocazioni-famose-matrimonio`, `/messaggi-vocazionali`, `/materiale-scaricabile`. La riduzione è deliberata (§10). Anche `/testimonianze` e `/testimonianze-matrimonio` spariscono **come pagine**: il loro testo rientra come blocco in fondo al percorso pertinente, che è dove il documento lo colloca.
- **Migrazione del contenuto vocazionale su Supabase.** Resta JSON nel repo: è testo istituzionale che cambia di rado, coerente col confine statico/dinamico già stabilito nella migrazione Supabase.

## 5. Architettura delle rotte

Rotte annidate, con `/vocazione` genitore che ospita la chrome di sezione:

```
/vocazione                     VocazioneHub        le 4 porte
  /discernimento               VocazionePercorso   sto cercando la mia strada
  /matrimonio                  VocazionePercorso
  /sacerdozio                  VocazionePercorso
  /vita-consacrata             VocazionePercorso
  /domande                     VocazioneDomande    le 8 Q&A
  /proposta                    VocazioneProposta
```

Il router attuale è piatto. L'annidamento viene introdotto qui perché il genitore è l'unico punto in cui collocare il presidio della lingua e la navigazione interna senza replicarli in sette view.

Ogni pagina ha un URL proprio e condivisibile: un frate deve poter mandare a un giovane il link della pagina che gli serve.

**Il menu principale non cambia.** Resta la voce "Vocazione" di oggi, che porta all'hub; la navigazione fra le sette pagine vive dentro `VocazioneLayout`. Un menu a tendina con sette voci contraddirebbe sia la sobrietà del sito sia l'impianto del documento, che vuole l'hub come soglia unica da cui si sceglie il percorso.

## 6. Comportamento multilingua

`/vocazione` oggi esiste in **tutte e sei le lingue** (~540 caratteri ciascuna) ed è linkata dal menu di ognuna. La sezione nuova non aggiunge contenuto dove non c'era: sostituisce una pagina già pubblicata.

Regola adottata — **nessuna regressione**:

| Lingua | `/vocazione` | `/vocazione/*` |
|--------|--------------|----------------|
| `it` | hub nuovo | percorsi nuovi |
| altre | pagina breve attuale, invariata | redirect a `/vocazione` |

Implementazione: un `beforeEnter` sulla rotta genitore. Un solo controllo, un solo posto.

**Caso da gestire, oggi inesistente nel sito:** l'utente cambia lingua mentre è dentro la sezione. Il layout osserva la lingua e riporta all'hub; senza questo si resta su una pagina che in quella lingua non esiste.

Se un domani si traduce, si promuove una lingua alla volta senza riprogettare nulla.

## 7. Standard del pilota

Questa sezione è il pilota: le sue regole valgono per il sito e vanno rese verificabili, altrimenti la fase 3 le eroderà come è già successo al CSS.

1. **Nessun valore visivo scritto a mano in un componente.** Colori, font e spaziature vengono solo dai token. *Verificata da test* (§11).
2. **I componenti di presentazione non toccano lo store né `$route`.** Ricevono props, emettono eventi. È ciò che li rende riusabili in fase 3.
3. **Un componente, un compito.** I blocchi stanno in `components/`, le view compongono.
4. **L'accesso a `localStorage` passa da un solo modulo.** Oggi la chiave `lang` è letta con varianti diverse in `App.vue`, `store/modules/page/index.js` e `store/modules/page/actions.js`: è duplicazione della stessa specie del CSS.

## 8. Componenti

### Fase 1 — fondamenta

`src/assets/css/tokens.css`, importato una volta in `main.js`:

```css
--mdv-bruno: #281d02;      --mdv-oro: #8c681c;
--mdv-oro-scuro: #59411a;  --mdv-sabbia: #c3ac7d;
--mdv-titolo: 'Bubbler One';  --mdv-corpo: 'Playfair Display';
--mdv-spazio-1 … 6           scala di spaziatura
```

Migrazione a token di `MdvNavbar`, `MdvFooter`, `src/components/ui/Base*`.

**Criterio di riuscita: il sito risulta identico a prima.** Una differenza visibile è un errore.

### Fase 2 — sezione

```
src/view/vocazione/            src/components/vocazione/
  VocazioneLayout.vue            VocPorte.vue          le 4 porte
  VocazioneHub.vue               VocProsa.vue          testo + titolo
  VocazionePercorso.vue          VocElenco.vue         elenchi, incl. "alcuni segni"
  VocazioneDomande.vue           VocPassi.vue          passi numerati
  VocazioneProposta.vue          VocRiflessioni.vue    domande + risposta
                                 VocTestimonianze.vue  testo + foto
                                 VocRimandi.vue        link agli altri percorsi
                                 VocFaq.vue            fisarmonica
```

I tipi di blocco `elenco` e `segni` usano lo **stesso** `VocElenco`, distinto da una prop `variante`: nel documento gli elenchi normali sono puntati, i "segni" hanno la spunta. Restano due tipi separati nel JSON perché la distinzione è di contenuto, non di resa.

`VocazionePercorso` è il renderer: legge `blocchi: [{ tipo, … }]` e mappa `tipo` sul componente corrispondente. Aggiungere una pagina vocazionale è scrivere JSON.

**Prefisso `Voc` e non `Mdv`:** `Mdv*` indica i componenti condivisi del sito, questi sono di sezione e stanno in una cartella propria. Deviazione deliberata dalla convenzione.

**Il blocco "proposta" non sta nei JSON dei percorsi.** Appare in fondo a ogni percorso, ma lo aggiunge `VocazionePercorso`: come blocco andrebbe ripetuto quattro volte nel contenuto e le copie divergerebbero al primo ritocco. Il suo invito porta a `/contatti`, non a un indirizzo email (§10).

`VocProsa` e `VocSegni` sono generici e verranno riusati in fase 3 senza modifiche.

## 9. Contenuto e flusso dati

### Dove vive

File nuovo `src/assets/data/vocazione.json`, **non** dentro `data.json`. Due ragioni: `data.json` è indicizzato prima per lingua e questo contenuto ne ha una sola; ed è già 1434 righe. I cicli di vita restano separati — `data.json` è il sito multilingua, `vocazione.json` è la sezione italiana.

### Struttura

```jsonc
{
  "hub":       { "header": {…}, "intro": "…", "porte": [ {…} x4 ], "chiusura": "…" },
  "percorsi":  { "discernimento": { "header": {…}, "blocchi": [ … ] }, … },
  "domande":   [ { "id": …, "domanda": "…", "risposta": "…" } x8 ],
  "proposta":  { … }
}
```

Blocchi riconosciuti:

```jsonc
{ "tipo": "prosa",         "titolo": "…", "testo": "markdown" }
{ "tipo": "elenco",        "titolo": "…", "voci": ["…"] }
{ "tipo": "segni",         "titolo": "…", "voci": ["…"] }
{ "tipo": "passi",         "titolo": "…", "passi": [ { "titolo": "…", "testo": "…" } ] }
{ "tipo": "riflessioni",   "titolo": "…", "domande": ["…"] }
{ "tipo": "testimonianze", "voci": [ { "nome": "…", "foto": "…", "testo": "…" } ] }
{ "tipo": "rimandi",       "titolo": "…", "voci": [ { "etichetta": "…", "rotta": "…" } ] }
```

### Flusso

```
vocazione.json  →  view (import diretto)  →  blocchi (props)
```

**Niente store Vuex per questa sezione.** Il modulo `page` esiste per fondere contenuto statico con Supabase e per reagire al cambio lingua: qui il contenuto è statico, italiano e non cambia a runtime. Aggiungere un modulo significherebbe sette `case` in più nello `switch` di `mutations.js`, che è già la parte più goffa del codice esistente.

Nessun passaggio asincrono: la pagina è pronta al primo render, senza spinner, a differenza di `/attivita` e `/contatti`.

**Costo accettato:** due modi di leggere contenuto nello stesso progetto. Il confine è netto e spiegabile in una riga — *multilingua o dinamico → store; italiano e statico → import diretto* — e la `/vocazione` legacy continua a passare dallo store, quindi la strada esistente non va riscritta.

## 10. Contenuto: cosa entra e cosa no

Il documento redazionale **riduce**, non accorpa. È deliberato: l'obiettivo dichiarato è snellire.

| | `mdv-vocational` | Documento |
|---|---|---|
| Rotte | 15 | 7 |
| Prosa | ~92 KB | ~20 KB |
| FAQ | 18 KB (`faq.json`) | le stesse 8 domande |

Le quattro pagine vocazionali passano da saggi a testi web (sacerdozio da 13,7 KB a 1,7 KB). **Il documento è la specifica: si segue.**

### Testimonianze — unica eccezione al taglio

Il documento le richiede esplicitamente, con i nomi come segnaposto e senza testo. Riempire quegli slot è essere fedeli al documento, non aggiungere contenuto.

| Slot nel documento | Materiale esistente |
|---|---|
| Mattia & Viviana | `testimonianze4.md`, 3,3 KB — **disponibile** |
| Sr Stella | `testimonianze1.md`, 6,8 KB + `t1.jpg` — **disponibile** |
| Sr. Lucia | **non esiste** |

`testimonianze3.md` è firmata *sorella Ilaria*, non Lucia — Lucia vi compare solo come persona incontrata. Esiste anche una quarta testimonianza non firmata (`testimonianze2.md`).

**Lacuna di contenuto aperta:** il testo di Sr. Lucia va richiesto alla comunità. Non è bloccante — il componente ne mostra un numero variabile — ma va deciso se pubblicare con due testimonianze o attendere.

**Immagini:** servite da `http://vocazione.altervista.org/hosted-images/`, oggi raggiungibili (HTTP 200). Vanno **scaricate** in `src/assets/img/vocazione/`, mai linkate: su un sito HTTPS il browser bloccherebbe risorse `http://` come mixed content. È anche l'occasione per staccare l'ultima dipendenza da quel dominio.

### Indirizzi email: non entrano nella sezione

Il documento riporta tre indirizzi (`camminovocazionale@`, `missionaridellavia.cassano@`, `missionariedellavia.cassano@`). **Nessuno di questi viene pubblicato nella sezione vocazionale**: i contatti sono già gestiti in `/contatti`, e replicarli qui creerebbe due punti di verità destinati a divergere.

Dove il documento chiude con un indirizzo — in fondo a "La nostra proposta" e a "Le vostre domande" — la sezione rimanda a `/contatti`. Il testo che descrive *cosa* viene offerto (accompagnamento spirituale, ritiri, il laboratorio per le coppie di sposi) resta: è contenuto vocazionale, non un recapito.

Conseguenza: la sezione non contiene `mailto:` né form propri, e la razionalizzazione degli indirizzi resta un problema di `/contatti`, fuori da questo lavoro.

## 11. Interattività e stato locale

Livello scelto: **il testo diventa percorso**, senza automatismi. Il documento afferma *"si tratta di un cammino, non di una corsa"*: un questionario che assegna una vocazione lo contraddirebbe apertamente ed è stato escluso.

- **Hub:** le 4 porte come scelta esplicita del percorso.
- **Passi:** i sei del discernimento con avanzamento visibile.
- **Per riflettere:** domande che si aprono una alla volta, con risposta libera conservata.
- **Domande:** fisarmonica, una risposta alla volta.

### Stato conservato

```
mdv.voc.<percorso>.riflessioni   { "0": "…", "2": "…" }
mdv.voc.<percorso>.passi         [0, 1, 2]
```

Incapsulato in `src/utility/vocStorage.js`, secondo la regola 4. Se `localStorage` non è disponibile — navigazione privata, quota, permessi — il modulo **degrada a memoria volatile**: l'interazione funziona per la sessione e non lancia eccezioni. `try/catch` attorno a ogni accesso, non attorno all'app.

### Trasparenza

Accanto alle "Per riflettere" va una riga esplicita — *le tue risposte restano su questo dispositivo, non le riceve nessuno* — e un comando per cancellarle. Chi scrive lì dentro qualcosa sulla propria vocazione deve poterlo togliere senza svuotare i dati del browser.

## 12. Casi limite

| Caso | Comportamento |
|---|---|
| Lingua ≠ it su `/vocazione/*` | redirect a `/vocazione` |
| Cambio lingua dentro la sezione | redirect all'hub |
| Slug inesistente (`/vocazione/xyz`) | all'hub di sezione, non alla home: il catch-all globale porterebbe a Home, disorientante dentro un percorso |
| Blocco con `tipo` sconosciuto | saltato, segnalato in console; un refuso non produce una pagina bianca |
| `localStorage` non disponibile | degrado a memoria volatile |

## 13. Verifica

### Cosa non è coperto

Il progetto ha `node --test` su `scripts/lib` e nient'altro: nessun framework per testare componenti, e non se ne introduce uno. **Il rendering dei componenti resta verificato guardando le pagine.** Compromesso dichiarato.

Per la fase 1 il criterio è "il sito resta identico" e non esiste regressione visiva automatica: si controlla a mano le sei pagine. La superficie è piccola — navbar, footer, `Base*` — ma è controllo umano.

### Cosa è coperto

Con `node --test`, le tre cose che si rompono da sole:

**1. Guardia dei token.** Cerca esadecimali e `font-family` nei `.vue` e fallisce se ne compaiono fuori da `tokens.css`. Parte con una **lista di deroga** contenente i file non ancora migrati, con la regola che **può solo accorciarsi**: diventa la lista di lavoro della fase 3 ed è impossibile allungarla per sbaglio.

**2. Integrità di `vocazione.json`.** Ogni blocco ha un `tipo` riconosciuto; ogni rimando punta a una rotta esistente; ogni immagine citata è presente in `assets`. Sono gli errori realistici su un sito di contenuto: refusi, non bug di logica.

**3. `vocStorage`.** Serializzazione e degrado quando `localStorage` lancia. Logica pura, si testa senza browser.

## 14. Dismissione di `mdv-vocational`

Fuori dallo scope implementativo di questa spec, ma da pianificare: una volta pubblicata la sezione, il repo va archiviato e il vecchio dominio rediretto. Da verificare separatamente cosa contenga `/materiale-scaricabile`: se ospita PDF o volantini realmente scaricati, toglierlo rimuove una funzione e non della prosa.

## 15. Rischi noti

| Rischio | Mitigazione |
|---|---|
| Due estetiche convivono fino a fine fase 3 | accettato; oppure si pubblica la sezione al termine della fase 3 |
| Le regole §7 si erodono nel tempo | la guardia dei token è un test; le altre tre restano convenzioni scritte |
| Testimonianza di Sr. Lucia mancante | pubblicare con due, o attendere il testo dalla comunità |
| La riduzione del contenuto scontenta chi ha scritto il materiale escluso | decisione redazionale già presa; il materiale resta nella storia di `mdv-vocational` |
