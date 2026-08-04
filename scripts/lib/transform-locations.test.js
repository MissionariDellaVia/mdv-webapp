const test = require('node:test');
const assert = require('node:assert');
const { transformAttivita, articlesToHtml } = require('./transform-locations');

test('articlesToHtml wraps markdown-bold lines into an HTML list', () => {
  const html = articlesToHtml([
    '**Santa Messa** Domenica ore 17:00',
    '**Rosario** Domenica ore 16:00',
  ]);
  assert.strictEqual(
    html,
    '<ul><li><strong>Santa Messa</strong> Domenica ore 17:00</li>' +
    '<li><strong>Rosario</strong> Domenica ore 16:00</li></ul>'
  );
});

test('transformAttivita maps groups->locations and sections->info', () => {
  const attivita = {
    main: { caption: 'A seguire le attività' },
    groups: [{
      key: 'madonna-dc',
      title: 'Santuario Madonna della Catena',
      sections: [{ articles: ['**Santa Messa** Domenica ore 17:00'], image: { url: ['attivita-1.png'] } }],
    }],
  };
  const result = transformAttivita(attivita, 'it');
  assert.strictEqual(result.length, 1);
  const loc = result[0];
  assert.strictEqual(loc.slug, 'madonna-dc');
  assert.strictEqual(loc.name, 'Santuario Madonna della Catena');
  assert.strictEqual(loc.lang, 'it');
  assert.strictEqual(loc.intro, 'A seguire le attività');
  assert.strictEqual(loc.position, 0);
  assert.strictEqual(loc.info.length, 1);
  assert.strictEqual(loc.info[0].position, 0);
  assert.ok(loc.info[0].body.includes('<strong>Santa Messa</strong>'));
  assert.deepStrictEqual(loc.info[0].imageFilenames, ['attivita-1.png']);
});

test('transformAttivita returns empty array when no groups', () => {
  assert.deepStrictEqual(transformAttivita({ groups: [] }, 'it'), []);
  assert.deepStrictEqual(transformAttivita({}, 'it'), []);
});
