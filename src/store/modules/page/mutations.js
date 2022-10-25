import navbar from '@/assets/data/navbar.json'

export default {
    setPage(state, payload) {
        switch (payload.page) {
            case 'chi-siamo':
                console.debug('set chi-siamo page');
                state.chiSiamo = payload.data;
                break;
            case 'attivita':
                console.debug('set attivita page');
                state.attivita = payload.data;
                break;
            case 'vocazione':
                console.debug('set vocazione page');
                state.vocazione = payload.data;
                break;
            case 'approfondimenti':
                console.debug('set approfondimenti page');
                state.approfondimenti = payload.data;
                break;
            case 'prega-con-noi':
                console.debug('set prega-con-noi page');
                state.pregaConNoi = payload.data;
                break;
            case 'contatti':
                console.debug('set contatti page');
                state.contatti = payload.data;
                break;
            default:
                console.debug(`Sorry, we are out of ${payload.data}.`);
                break;
        }
    },
    setNavbar(state, lang) {
        switch (lang) {
            case 'it':
                console.debug('set it lang');
                state.navbar = navbar.it;
                break;
            case 'en':
                console.debug('set en lang');
                state.navbar = navbar.en;
                break;
            case 'pl':
                console.debug('set pl lang');
                state.navbar = navbar.pl;
                break;
            case 'pt':
                console.debug('set pt lang');
                state.navbar = navbar.pt;
                break;
            case 'es':
                console.debug('set es lang');
                state.navbar = navbar.es;
                break;
            default:
                console.debug('set it lang');
                state.navbar = navbar.it;
                break;
        }
    }
}