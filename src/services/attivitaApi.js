const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'https://www.missionaridellavia.net/api/v1';
const API_KEY = process.env.VUE_APP_API_KEY;

const headers = {
    'X-Api-Key': API_KEY
};

export const attivitaImageService = {
    /**
     * List all images for a specific key
     * @param {string} key - Activity key (e.g., "madonna-dc")
     * @returns {Promise<Object>} Response with images array
     */
    async listImages(key) {
        if (!key) {
            throw new Error('Key parameter is required');
        }

        const response = await fetch(`${API_BASE_URL}/images.php?key=${encodeURIComponent(key)}`, {
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch images');
        }

        return await response.json();
    },

    /**
     * Upload an image for a specific key
     * @param {File} file - Image file to upload
     * @param {string} key - Activity key (e.g., "madonna-dc")
     * @returns {Promise<Object>} Response with uploaded image details
     */
    async uploadImage(file, key) {
        if (!file) {
            throw new Error('File parameter is required');
        }
        if (!key) {
            throw new Error('Key parameter is required');
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', key);

        const response = await fetch(`${API_BASE_URL}/images.php`, {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(error.error || 'Failed to upload image');
        }

        return await response.json();
    },

    /**
     * Delete an image for a specific key
     * @param {string} filename - Filename to delete
     * @param {string} key - Activity key (e.g., "madonna-dc")
     * @returns {Promise<Object>} Response confirming deletion
     */
    async deleteImage(filename, key) {
        if (!filename) {
            throw new Error('Filename parameter is required');
        }
        if (!key) {
            throw new Error('Key parameter is required');
        }

        const response = await fetch(`${API_BASE_URL}/images.php`, {
            method: 'DELETE',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename, key })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete image');
        }

        return await response.json();
    }
};

export const attivitaDataService = {
    async getAttivita(lang = 'it') {
        const response = await fetch(
            `${process.env.VUE_APP_FIREBASE_DATABASE_URL}/pages/${lang}/attivita.json`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch attività data');
        }

        return await response.json();
    },

    async saveAttivita(data, lang = 'it') {
        // Ottieni il token di autenticazione da localStorage
        const token = localStorage.getItem('token');

        // Costruisci l'URL con il token di autenticazione
        const url = token
            ? `${process.env.VUE_APP_FIREBASE_DATABASE_URL}/pages/${lang}/attivita.json?auth=${token}`
            : `${process.env.VUE_APP_FIREBASE_DATABASE_URL}/pages/${lang}/attivita.json`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Failed to save attività data');
        }

        return await response.json();
    },

    async updateGroup(groupKey, groupData, lang = 'it') {
        const attivita = await this.getAttivita(lang);
        const groupIndex = attivita.groups.findIndex(g => g.key === groupKey);

        if (groupIndex === -1) {
            attivita.groups.push(groupData);
        } else {
            attivita.groups[groupIndex] = groupData;
        }

        return await this.saveAttivita(attivita, lang);
    },

    async deleteGroup(groupKey, lang = 'it') {
        const attivita = await this.getAttivita(lang);
        attivita.groups = attivita.groups.filter(g => g.key !== groupKey);
        return await this.saveAttivita(attivita, lang);
    }
};
