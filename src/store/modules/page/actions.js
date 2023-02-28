export default {
    async loadPage(context, page) {
        console.debug("BEGIN: action -> page/loadPage");
        const token = localStorage.getItem('token');
        console.log(token);

        let lang = localStorage.getItem("lang");
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

        localStorage.setItem('lang', ''+payload.lang);
        context.commit('setNavbar', payload.lang);
        context.commit('setFooter', payload.lang);

        await context.dispatch('loadPage', payload.route);
    },
    async updateArticles(context, activity) {
        console.debug("BEGIN: action -> page/loadPage");
        let lang = localStorage.getItem("lang");
        let token = localStorage.getItem('token');

        const response = await fetch(
            `${process.env.VUE_APP_FIREBASE_DATABASE_URL}/pages/${lang}/attivita/groups/${activity.groupIndex}/sections/${activity.sectionIndex}/articles/${activity.articleIndex}.json?auth=${token}`, {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(activity.article)
            }
        );
        const responseData = await response.json();
        if (!response.ok) {
            console.log("Errore nella richiesta");
            throw new Error(responseData.message || 'Failed to fetch!');
        }

        context.commit('setArticles', { article: responseData, groupIndex: activity.groupIndex, sectionIndex: activity.sectionIndex, articleIndex: activity.articleIndex });
    },
}