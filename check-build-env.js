// Script per verificare i valori delle variabili d'ambiente nella build
// Esegui: node check-build-env.js

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist', 'js');

if (!fs.existsSync(distPath)) {
  console.log('❌ Cartella dist/js non trovata. Esegui prima "npm run build"');
  process.exit(1);
}

const files = fs.readdirSync(distPath);
const appFiles = files.filter(f => f.startsWith('app.') && f.endsWith('.js'));

if (appFiles.length === 0) {
  console.log('❌ Nessun file app.*.js trovato in dist/js');
  process.exit(1);
}

const appFile = path.join(distPath, appFiles[0]);
const content = fs.readFileSync(appFile, 'utf8');

console.log('🔍 Verifica variabili d\'ambiente nella build:\n');

// Cerca i valori hardcoded
const checks = [
  { name: 'VUE_APP_API_BASE_URL', expected: 'missionaridellavia.net/api/v1' },
  { name: 'VUE_APP_AUTH_BASE_URL', expected: 'missionaridellavia.net/auth/api' },
  { name: 'VUE_APP_SERVER_BASE_URL', expected: 'missionaridellavia.net' },
  { name: 'VUE_APP_FIREBASE_DATABASE_URL', expected: 'mdv-webapp-default-rtdb' }
];

let allCorrect = true;

checks.forEach(check => {
  if (content.includes(check.expected)) {
    console.log(`✅ ${check.name}: trovato "${check.expected}"`);
  } else {
    console.log(`❌ ${check.name}: NON trovato "${check.expected}"`);
    allCorrect = false;
  }
});

// Verifica che non ci siano riferimenti a localhost
if (content.includes('localhost:8000')) {
  console.log('\n⚠️  ATTENZIONE: Trovato riferimento a "localhost:8000" nella build!');
  console.log('   Verifica che stai usando npm run build (non npm run serve)');
  allCorrect = false;
} else {
  console.log('\n✅ Nessun riferimento a localhost:8000 trovato');
}

if (allCorrect) {
  console.log('\n✅ Tutti i controlli sono passati! La build è pronta per la produzione.');
} else {
  console.log('\n❌ Alcuni controlli sono falliti. Verifica il file .env.production');
}
