import navbar from '@/assets/data/navbar.json'
import footer from '@/assets/data/footer.json'

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
            case 'fr':
                console.debug('set fr lang');
                state.navbar = navbar.fr;
                break;
            default:
                console.debug('set it lang');
                state.navbar = navbar.it;
                break;
        }
    },
    setFooter(state, lang) {
        switch (lang) {
            case 'it':
                console.debug('set it lang');
                state.footer = footer.it;
                break;
            case 'en':
                console.debug('set en lang');
                state.footer = footer.en;
                break;
            case 'pl':
                console.debug('set pl lang');
                state.footer = footer.pl;
                break;
            case 'pt':
                console.debug('set pt lang');
                state.footer = footer.pt;
                break;
            case 'es':
                console.debug('set es lang');
                state.footer = footer.es;
                break;
            case 'fr':
                console.debug('set fr lang');
                state.footer = footer.fr;
                break;
            default:
                console.debug('set it lang');
                state.footer = footer.it;
                break;
        }
    },
    setArticles(state, payload) {
        state.attivita
            .groups[payload.groupIndex]
            .sections[payload.sectionIndex]
            .articles[payload.articleIndex] = payload.article;
    }

}