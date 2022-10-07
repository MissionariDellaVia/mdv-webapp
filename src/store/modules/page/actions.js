export default {
    async loadPage(context, page) {
        console.log("BEGIN: action -> page/loadPage");
        const response = await fetch(
            `https://mdv-webapp-default-rtdb.europe-west1.firebasedatabase.app/pages/${page}.json`
        );
        const responseData = await response.json();
        if (!response.ok) {
            console.log("Errore nella richiesta");
            throw new Error(responseData.message || 'Failed to fetch!');
        }

        context.commit('setPage', { data: responseData, page: page});
    }
}