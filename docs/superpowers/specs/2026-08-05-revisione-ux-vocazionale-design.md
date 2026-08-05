# Revisione UX della sezione vocazionale: soglia, navigazione, movimento

**Data:** 2026-08-05
**Stato:** Design approvato — in attesa di review della spec
**Presuppone:** `2026-08-04-sezione-vocazionale-design.md`, implementato sul branch `feat/sezione-vocazionale`

---

## 1. Contesto e problema

La sezione vocazionale è costruita e funziona, ma alla prova d'uso è risultata **un lettore di testi, non un cammino**. I difetti riscontrati sono tre, e i primi due sono di navigazione, non di gusto:

**Non si sa dove si è.** Dentro la sezione nulla segnala che esistono sette pagine né quale si sta leggendo. Ogni pagina sembra un vicolo cieco.

**Non si esce.** L'unico ritorno è il link «Torna all'inizio del cammino» in fondo alla pagina. Dopo una risposta da 3.000 caratteri bisogna risalire tutto per uscire.

**Non si percepisce una soglia.** Entrare nella sezione è indistinguibile dal cambiare qualsiasi altra pagina del sito, mentre il contenuto chiede raccoglimento.

A questo si aggiunge una scoperta emersa studiando la navbar: **la guardia dei token verifica meno di quanto dichiara** (§8).

## 2. Obiettivo

Rendere la sezione navigabile e riconoscibile come luogo a sé, senza tradire la sobrietà che la comunità esprime.

### Principio guida

**Il cinema sta nella transizione, non nella destinazione.** Il momento di passaggio è netto e si nota; la pagina dove si atterra resta chiara, quieta e leggibile. Dentro ci sono testi lunghi che vanno letti per intero: una sezione scenografica ma faticosa fallirebbe il suo scopo.

Corollario: ogni movimento deve segnalare qualcosa — c'è altro sotto, questo si è aperto, quello è fatto. Il movimento che non informa si taglia.

## 3. Scope

### In scope

- Cambio di atmosfera cromatica all'ingresso della sezione, con soglia animata.
- Barra di sezione fissa con ritorno e indice a richiesta.
- Movimento funzionale su fisarmoniche, blocchi e transizioni di pagina.
- Rispetto di `prefers-reduced-motion` e focus da tastiera visibile.
- Migrazione ai token di `src/view/Vocazione.vue` (§4).
- Estensione della guardia dei token a `rgb()`, `rgba()`, `hsl()` e correzione dei file che ne emergono (§8).

### Fuori scope

- **Restyling delle 6 pagine esistenti** — resta la fase 3.
- **Modifiche al contenuto** di `vocazione.json`.
- **Framework di test per componenti** — invariato: il rendering non è coperto da test.
- **Regressione visiva automatica** — non esiste infrastruttura.
- **Rimozione di `animate.css`**, importato in `main.js` e mai usato. Segnalato, non trattato: tocca l'intero sito, non questa sezione.

## 4. Atmosfera e soglia

### Dove vive la classe

Vincolo strutturale: in `App.vue` navbar e footer sono **fratelli** del `router-view`, non discendenti.

```
<div>                    <- unico punto da cui la cascata raggiunge tutto
  <MdvNavbar />
  <router-view />        <- VocazioneLayout vive qui dentro
  <MdvFooter />
</div>
```

Una classe sul layout di sezione lascerebbe la navbar del colore precedente, spezzando l'effetto a metà schermo. Quindi **`App.vue` osserva la rotta** e applica `voc-atmosfera` al contenitore radice quando il percorso inizia per `/vocazione`.

La condizione è una funzione pura, `inVocazione(path)`, testabile senza browser.

### L'atmosfera è una ridefinizione di token

Nessun foglio di stile parallelo, nessuna regola nuova sui componenti: gli stessi `var(--mdv-*)` che già usano cambiano valore.

```css
.voc-atmosfera {
  --mdv-bianco: #faf6ee;
  --mdv-bruno-900: #1d1508;
  --mdv-crema: #f0e7d6;
  --mdv-sabbia: #b89f6d;
  transition: background-color 700ms ease, color 700ms ease;
}
```

I valori di destinazione restano chiari: fondo caldo, testo profondo. Nessuna inversione su fondo scuro — scelta deliberata, motivata dalla leggibilità dei testi lunghi e dal comportamento a specchio degli schermi in esterno.

### La soglia

Velo a tutto schermo in `position: fixed` — così copre anche la navbar — che attraversa in ~700ms.

Si innesca sul **montaggio di `VocazioneLayout`**. Il layout si monta una volta sola all'ingresso e resta montato mentre si naviga fra le sette pagine: il velo scatta entrando e **non** si ripete a ogni clic interno. Ripeterlo lo renderebbe irritante entro il terzo utilizzo.

### Migrazione di `src/view/Vocazione.vue`

Quella pagina è ciò che le lingue non italiane vedono su `/vocazione`: sta dentro la sezione e riceve l'atmosfera, ma avendo i colori scritti a mano risponderebbe solo in parte, con risultato incoerente. Va migrata ai token. La lista di deroga scende di uno.

## 5. Barra di sezione

### Posizionamento

La navbar è `fixed-top` alta `6.5rem`. La barra si àncora sotto con `position: sticky; top: var(--mdv-altezza-navbar)`.

Quel valore oggi è scritto a mano dentro `MdvNavbar`: diventa un token, così la barra non lo duplica e non si scolla se la navbar cambia.

### Componente

`src/components/vocazione/VocBarraSezione.vue`, di sola presentazione.

- **Props:** `pagine: Array<{nome, etichetta, gruppo}>`, `rottaCorrente: String`
- **Non tocca `$route` né lo store** (regola 2). È `VocazioneLayout` — una view, quindi legittimata — a leggere la rotta e passarla.
- Il pannello dell'indice si chiude osservando il cambio di `rottaCorrente`, senza conoscere il router.
- La navigazione avviene con `router-link`, che non viola la regola: non è accesso allo stato della rotta.

Struttura resa:

```
← Vocazione  ›  Sacerdozio ⌄
```

Il nome della pagina corrente apre l'indice, con la voce attiva marcata e una riga di separazione fra i quattro percorsi e le due pagine di servizio.

**L'hub non compare nell'indice** ed è raggiunto dalla freccia: elencarlo sarebbe ridondante con il ritorno che gli sta accanto. L'indice ha quindi **sei voci**, non sette.

**Sull'hub la barra non viene mostrata.** Lì il ritorno non ha destinazione e le quattro porte sono già in pagina: l'hub *è* l'indice. Mostrarla aggiungerebbe una riga inutile proprio nel punto che deve risultare più aperto.

### L'indice è un file di dati condiviso

`src/assets/data/indice-vocazione.json`:

```json
[
  { "nome": "vocazione-discernimento",   "etichetta": "Sto cercando la mia strada", "gruppo": "percorsi" },
  { "nome": "vocazione-matrimonio",      "etichetta": "Matrimonio",                 "gruppo": "percorsi" },
  { "nome": "vocazione-sacerdozio",      "etichetta": "Sacerdozio",                 "gruppo": "percorsi" },
  { "nome": "vocazione-vita-consacrata", "etichetta": "Vita consacrata",            "gruppo": "percorsi" },
  { "nome": "vocazione-domande",         "etichetta": "Le vostre domande",          "gruppo": "altro" },
  { "nome": "vocazione-proposta",        "etichetta": "La nostra proposta",         "gruppo": "altro" }
]
```

**JSON e non un modulo `.mjs`** per una ragione precisa: così lo leggono sia il layout (import di webpack) sia i test in CommonJS. Questo elimina la lista di rotte oggi copiata dentro `valida-vocazione.test.js`: il test dei rimandi la prende da qui, e un nome sbagliato viene segnalato.

Il campo `gruppo` serve solo alla barra.

### Rimozione

Il link «Torna all'inizio del cammino» in fondo a `VocazioneLayout` sparisce: con la freccia sempre presente diventa ridondante, e ridondante in fondo a una pagina lunga è esattamente il difetto da correggere.

## 6. Movimento

| Dove | Cosa | Perché |
|---|---|---|
| Fisarmoniche (passi, riflessioni, domande) | `auto-animate` | Oggi il contenuto appare di scatto e non si vede cosa si è aperto |
| Blocchi | dissolvenza + 8px verso l'alto, **una volta sola** | Segnala che la pagina continua |
| Fra le pagine della sezione | dissolvenza incrociata 300ms | Lo `scale` attuale è uno scatto |
| Porte dell'hub | sollevamento al passaggio del mouse | Già presente, si mantiene |
| Passi | il numero si riempie d'oro | Già presente, segnala l'avanzamento |

`@formkit/auto-animate` è **già nel bundle** — registrato in `main.js` e mai usato in un solo componente. Adottarlo non aggiunge peso.

La rivelazione allo scroll è una direttiva `v-rivela` con `IntersectionObserver` che **si disconnette dopo aver rivelato**: se il movimento si ripetesse a ogni passaggio, rileggere una pagina diventerebbe faticoso.

La transizione fra pagine usa la stessa condizione `inVocazione` già necessaria per l'atmosfera: nessuna logica aggiuntiva.

## 7. Accessibilità

Interruttore globale in `tokens.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

Copre velo, atmosfera e rivelazioni. Chi attiva quella preferenza spesso lo fa per disturbi vestibolari, e un velo a tutto schermo è precisamente ciò che li scatena.

La barra diventa il principale strumento di navigazione della sezione: **focus da tastiera visibile** su freccia, apertura dell'indice e voci del pannello, e chiusura del pannello con `Esc`.

## 8. La lacuna della guardia dei token

La guardia verifica esadecimali e `font-family`. **Non verifica `rgb()`, `rgba()` e `hsl()`.**

`MdvNavbar`, dichiarata migrata, contiene ancora:

```css
.changeColor { background: rgb(40, 29, 2, 0.9); }
```

Lo stesso valore compare **16 volte** nel progetto. La regola 1 promette «nessun valore visivo scritto a mano» ma ne verificava circa metà: una garanzia parziale spacciata per totale è peggio di nessuna garanzia, perché la fase 3 verrebbe costruita sopra.

**Correzione:** l'estrattore riconosce anche le notazioni funzionali di colore. Alcuni dei nove file già migrati torneranno a fallire e vanno sistemati in questo giro. È lavoro non previsto, ed è il motivo per cui va fatto adesso e non dopo.

Dimensione misurata del lavoro emergente, sui soli file già migrati:

```
4 x rgb(40, 29, 2, 0.9)        -> --mdv-bruno-900-velato (token esistente)
1 x rgba(248, 248, 248, 0.9)   -> token nuovo
3 x rgba(0, 0, 0, …)           -> ombre: token dedicati
```

Otto occorrenze in tutto: contenuto. Le ombre nere non sono colori di marca e ricevono token propri (`--mdv-ombra-*`) invece di essere forzate nella palette.

I valori `rgb()` che emergono si mappano su token esistenti dove corrispondono (`rgb(40, 29, 2, 0.9)` → `--mdv-bruno-900-velato`); dove non corrispondono si aggiunge il token.

## 9. Verifica

### Non coperto

Invariato rispetto alla spec precedente: **nessun test sul rendering**, nessuna regressione visiva. Velo, atmosfera, barra e rivelazioni si verificano guardandoli.

### Coperto

- **Guardia dei token estesa** — fallisce su esadecimali, `font-family`, `rgb()`, `rgba()`, `hsl()` fuori da `tokens.css`.
- **`inVocazione(path)`** — funzione pura: dentro per `/vocazione` e discendenti, fuori per tutto il resto, inclusi casi limite come `/vocazionale`.
- **Coerenza indice/contenuto** — i rimandi di `vocazione.json` validati contro `indice-vocazione.json`, che diventa l'unica fonte dei nomi di rotta.

### Manuale

Percorso: entrare nella sezione da una pagina esterna e osservare velo e cambio atmosfera; navigare fra tre pagine e verificare che il velo **non** si ripeta; usare la barra per tornare e per saltare a un'altra pagina; aprire una fisarmonica; attivare «riduci movimento» a livello di sistema e ripetere; percorrere la barra con Tab.

## 10. Rischi noti

| Rischio | Mitigazione |
|---|---|
| La correzione della guardia fa emergere più lavoro del previsto | È lavoro dovuto: si affronta ora, prima che la fase 3 vi si appoggi |
| La soglia irrita chi entra e esce spesso dalla sezione | Scatta solo al montaggio del layout, non fra le pagine interne |
| La barra sticky ruba spazio verticale su mobile | Una riga sola, tipografia piccola; l'indice sta in un pannello a richiesta |
| Il cambio di atmosfera riduce il contrasto dei testi | I valori di destinazione restano chiari; da verificare a occhio sui testi lunghi delle domande |
