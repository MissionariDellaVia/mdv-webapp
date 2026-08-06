import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwind from '@tailwindcss/vite';
import { rotteDaPubblicare } from './src/router/instradamento.mjs';
import { basePer } from './src/utility/pubblicazione.mjs';

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

export default defineConfig(({ mode }) => ({
  // Quale radice, e perche', sta scritto in pubblicazione.mjs: il build
  // di produzione e quello di collaudo sono lo stesso comando, e solo la
  // modalita' li distingue.
  base: basePer(mode),
  plugins: [vue(), tailwind(), sitemap()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 9191,
  },
  build: {
    // La pubblicazione carica questa cartella cosi' com'e': il nome sta
    // scritto anche in .github/workflows/cicd.yml.
    outDir: 'dist',
  },
}));
