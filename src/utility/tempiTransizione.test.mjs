import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { USCITA_PAGINA_MS, RITARDO_SCROLL_MS, scrollDifferito } from './tempiTransizione.mjs';

test('la durata di uscita combacia con il token CSS', () => {
  const css = fs.readFileSync('src/assets/css/tokens.css', 'utf8');
  const trovato = css.match(/--mdv-uscita-pagina:\s*(\d+)ms/);
  assert.ok(trovato, 'token --mdv-uscita-pagina assente da tokens.css');
  assert.strictEqual(Number(trovato[1]), USCITA_PAGINA_MS);
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
