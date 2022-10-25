export default {
    async loadPage(context, page) {
        console.debug("BEGIN: action -> page/loadPage");
        let lang = window.localStorage.getItem("lang");
        const response = await fetch(
            `${process.env.VUE_APP_FIREBASE_DATABASE_URL}/pages/${lang}/${page}.json`
        );
        const responseData = await response.json();
        if (!response.ok) {
            console.log("Errore nella richiesta");
            throw new Error(responseData.message || 'Failed to fetch!');
        }

        context.commit('setPage', { data: responseData, page: page});
    },
    async changeLang(context, payload) {
        console.debug("BEGIN: action -> page/changeLang");
        console.debug("lang:" + payload.lang + ", page:" + payload.route);

        window.localStorage.setItem('lang', payload.lang);
        context.commit('setNavbar', payload.lang);

        await context.dispatch('loadPage', payload.route);
    }
}