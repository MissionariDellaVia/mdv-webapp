export default {
    async loadPage(context, page) {
        console.debug("BEGIN: action -> page/loadPage");
        const response = await fetch(
            `${process.env.VUE_APP_FIREBASE_DATABASE_URL}/pages/${page}.json`
        );
        const responseData = await response.json();
        if (!response.ok) {
            console.log("Errore nella richiesta");
            throw new Error(responseData.message || 'Failed to fetch!');
        }

        context.commit('setPage', { data: responseData, page: page});
    }
}