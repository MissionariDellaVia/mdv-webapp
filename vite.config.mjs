import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { rotteDaPubblicare } from './src/router/instradamento.mjs';

const BASE_SITO = 'https://www.missionaridellavia.net';

// La sitemap la scriveva un plugin webpack che qui non esiste piu'. Sono
// dodici righe: quali rotte dichiarare continua a deciderlo
// instradamento.mjs, insieme alla modalita' del router, e il test verifica
// che il file prodotto rispecchi quella scelta.
function sitemap() {
  return {
    name: 'mdv-sitemap',
    apply: 'build',
    generateBundle() {
      const voci = rotteDaPubblicare().map((rotta) => [
        '  <url>',
        `    <loc>${BASE_SITO}${rotta.path}</loc>`,
        `    <lastmod>${rotta.lastmod}</lastmod>`,
        `    <changefreq>${rotta.changefreq}</changefreq>`,
        `    <priority>${rotta.priority.toFixed(1)}</priority>`,
        '  </url>',
      ].join('\n'));

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...voci,
          '</urlset>',
          '',
        ].join('\n'),
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  // In sviluppo il sito sta sotto /mdv-webapp/ come prima, in produzione
  // alla radice: cambiarlo adesso spaccherebbe i segnalibri di chi lavora.
  base: command === 'build' ? '/' : '/mdv-webapp/',
  plugins: [vue(), sitemap()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 9191,
  },
  build: {
    // Stessa cartella di prima: lo script di deploy la cerca per nome.
    outDir: 'dist',
  },
}));
