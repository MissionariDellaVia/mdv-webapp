export default {
    setPage(state, payload) {
        switch (payload.page) {
            case 'chi-siamo':
                console.log('set chi-siamo page');
                console.log('chi-siamo -> ' + + JSON.stringify(payload.data));
                state.chiSiamo = payload.data;
                break;
            case 'attivita':
                console.log('set attivita page');
                state.attivita = payload.data;
                break;
            case 'vocazione':
                console.log('set vocazione page');
                state.vocazione = payload.data;
                break;
            case 'approfondimenti':
                console.log('set approfondimenti page');
                state.approfondimenti = payload.data;
                break;
            default:
                console.log(`Sorry, we are out of ${payload.data}.`);
                break;
        }
    }
}