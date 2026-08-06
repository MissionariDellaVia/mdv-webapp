import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import {
  USCITA_PAGINA_MS, SOGLIA_MS, RITARDO_SCROLL_MS, scrollDifferito,
} from './tempiTransizione.mjs';

const css = fs.readFileSync('src/assets/css/tokens.css', 'utf8');

function tokenMs(nome) {
  const trovato = css.match(new RegExp(`--${nome}:\\s*(\\d+)ms`));
  assert.ok(trovato, `token --${nome} assente da tokens.css`);
  return Number(trovato[1]);
}

// Se i due valori divergono, il JavaScript smonta il velo prima che il
// CSS lo abbia alzato — o lo lascia in giro dopo. Nessuno se ne
// accorgerebbe leggendo il codice: se ne accorge questo test.
test('le durate del JavaScript combaciano con i token CSS', () => {
  assert.strictEqual(tokenMs('mdv-uscita-pagina'), USCITA_PAGINA_MS);
  assert.strictEqual(tokenMs('mdv-soglia'), SOGLIA_MS);
});

test('lo scroll parte prima che l\'uscita finisca', () => {
  assert.ok(RITARDO_SCROLL_MS > 0);
  assert.ok(RITARDO_SCROLL_MS < USCITA_PAGINA_MS);
});

test('lo scroll differito restituisce la destinazione ricevuta', async () => {
  assert.deepStrictEqual(await scrollDifferito({ top: 0 }, 0), { top: 0 });
  assert.deepStrictEqual(
    await scrollDifferito({ el: '#voc-contenuto', top: 120 }, 0),
    { el: '#voc-contenuto', top: 120 },
  );
});
