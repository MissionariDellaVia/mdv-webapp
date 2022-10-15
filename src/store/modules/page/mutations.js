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
            default:
                console.debug(`Sorry, we are out of ${payload.data}.`);
                break;
        }
    }
}