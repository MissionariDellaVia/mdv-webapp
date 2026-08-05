// src/utility/direttivaRivela.mjs
// Rivela un elemento quando entra in vista, una volta sola: se il movimento
// si ripetesse a ogni scorrimento, rileggere una pagina diventerebbe faticoso.
export const direttivaRivela = {
  mounted(el) {
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (ridotto || typeof IntersectionObserver === 'undefined') {
      el.classList.add('rivelato');
      return;
    }

    el.classList.add('da-rivelare');
    const osservatore = new IntersectionObserver((voci) => {
      voci.forEach((voce) => {
        if (!voce.isIntersecting) return;
        voce.target.classList.add('rivelato');
        osservatore.disconnect();
      });
    }, { threshold: 0.1 });
    osservatore.observe(el);
  },
};
