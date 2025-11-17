const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'https://www.missionaridellavia.net/api/v1';

async function getImagesForKey(key) {
    try {
        if (!key) {
            console.warn('Nessuna key specificata per il caricamento immagini');
            return [];
        }

        console.debug(`Caricamento immagini per key: ${key}`);
        const response = await fetch(`${API_BASE_URL}/images.php?key=${encodeURIComponent(key)}`);

        if (!response.ok) {
            console.error(`Errore API images per key ${key}:`, response.status);
            return [];
        }

        const data = await response.json();
        console.debug(`Risposta API images per key ${key}:`, data);

        if (data.success && data.images && Array.isArray(data.images)) {
            const urls = data.images.map(img => img.url);
            console.debug(`Trovate ${urls.length} immagini per key ${key}:`, urls);
            return urls;
        }
        return [];
    } catch (error) {
        console.error(`Errore caricamento immagini per key ${key}:`, error);
        return [];
    }
}

export default {
    async loadPage(context, page) {
        console.debug("BEGIN: action -> page/loadPage");
        let lang = localStorage.getItem("lang");
        const response = await fetch(
            `${process.env.VUE_APP_FIREBASE_DATABASE_URL}/pages/${lang}/${page}.json`
        );
        const responseData = await response.json();
        if (!response.ok) {
            console.log("Errore nella richiesta");
            throw new Error(responseData.message || 'Failed to fetch!');
        }

        if (page === 'attivita') {
            console.debug("=== CARICAMENTO ATTIVITÀ ===");
            console.debug("Strategia: Carica immagini per ogni gruppo basandosi sulla key");

            if (responseData.groups && Array.isArray(responseData.groups)) {
                for (let gIndex = 0; gIndex < responseData.groups.length; gIndex++) {
                    const group = responseData.groups[gIndex];

                    if (!group.key) {
                        console.warn(`Gruppo ${gIndex} senza key, salto caricamento immagini`);
                        continue;
                    }

                    // Carica immagini specifiche per questa key
                    const imageUrls = await getImagesForKey(group.key);

                    if (imageUrls.length === 0) {
                        console.warn(`Nessuna immagine trovata per key "${group.key}". Carica immagini dall'admin.`);
                    }

                    if (group.sections && Array.isArray(group.sections)) {
                        group.sections.forEach((section, sIndex) => {
                            console.debug(`Gruppo "${group.key}" (${gIndex}), sezione ${sIndex}: "${section.title || 'Senza titolo'}"`);

                            // Determina il formato dell'URL in base al numero di immagini
                            let urlValue = null;
                            if (imageUrls.length === 1) {
                                // Una sola immagine: passa la stringa direttamente (senza carousel)
                                urlValue = imageUrls[0];
                                console.debug(`✓ Assegnata 1 immagine (modalità singola) dalla key "${group.key}"`);
                            } else if (imageUrls.length > 1) {
                                // Più immagini: passa l'array (con carousel)
                                urlValue = imageUrls;
                                console.debug(`✓ Assegnate ${imageUrls.length} immagini (modalità carousel) dalla key "${group.key}"`);
                            } else {
                                console.debug(`✗ Nessuna immagine disponibile per key "${group.key}"`);
                            }

                            // Ogni sezione mostra le immagini del suo gruppo (basate sulla key)
                            section.image = {
                                url: urlValue,
                                align: section.image?.align || 'right'
                            };
                        });
                    }
                }
            }

            console.debug("=== ATTIVITÀ PROCESSATE ===");
            console.debug("Ogni gruppo ora mostra le immagini dalla sua cartella specifica");
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
    }
}
