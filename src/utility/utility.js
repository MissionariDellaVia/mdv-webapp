import { urlImmagine } from './immagini.mjs';

export const utilityFunction = {
    getImgUrl: (pic) => {
        if (!pic) return '';
        // Le immagini di Supabase Storage arrivano gia' come indirizzo
        // completo: passano invariate.
        if (/(http(s?)):\/\//i.test(pic)) {
            return pic;
        }
        return urlImmagine(pic);
    },
    toCamelCase: (str) => str.replace(/-([a-z])/g, (m, p1) => p1.toUpperCase())
}
