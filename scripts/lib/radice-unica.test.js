const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { radiciDi } = require('./radice-unica');

test('una radice sola viene contata come una', () => {
  assert.deepStrictEqual(radiciDi('<template><section><p>ciao</p></section></template>'), ['section']);
});

test('lo spazio fra i tag non conta come radice', () => {
  assert.deepStrictEqual(radiciDi('<template>\n  <div/>\n</template>'), ['div']);
});

test('un commento accanto alla radice conta: e\' il caso che rompe tutto', () => {
  const sfc = '<template>\n  <!-- nota -->\n  <section/>\n</template>';
  assert.deepStrictEqual(radiciDi(sfc, 'x.vue'), ['commento', 'section']);
});

test('v-if e v-else restano una radice sola', () => {
  const sfc = '<template><a v-if="x"/><b v-else/></template>';
  assert.deepStrictEqual(radiciDi(sfc), ['a', 'b']);
});

test('un file senza template non ha radici da controllare', () => {
  assert.deepStrictEqual(radiciDi('<script>export default {}</script>'), []);
});

// --- Le viste vere -----------------------------------------------------

function fileVue(dir, acc = []) {
  for (const voce of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, voce.name);
    if (voce.isDirectory()) fileVue(p, acc);
    else if (voce.name.endsWith('.vue')) acc.push(p);
  }
  return acc;
}

test('ogni vista ha una radice sola', () => {
  const colpevoli = [];
  for (const f of fileVue('src/view')) {
    const radici = radiciDi(fs.readFileSync(f, 'utf8'), f);
    // v-if/v-else sono elementi alternativi: a schermo ne vive uno solo.
    // Un commento invece resta, e la radice diventa davvero multipla.
    if (radici.includes('commento') || radici.filter((r) => r === 'testo').length) {
      colpevoli.push(`${f}: ${radici.join(', ')}`);
    }
  }
  assert.deepStrictEqual(
    colpevoli, [],
    'una vista dentro <transition> deve esporre un solo nodo radice: '
    + 'spostare i commenti dentro l\'elemento radice',
  );
});
