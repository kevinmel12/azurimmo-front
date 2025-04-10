/**
 * Service HTTP pour gérer les appels API
 */
export default class HttpService {
    /**
     * Effectue une requête GET
     */
    static async get(url: string) {
        console.log(`[GET] Requête vers: ${url}`);
        try {
            const response = await fetch(url);
            console.log(`[GET] Statut de réponse: ${response.status}`);

            // Déboguer le contenu brut
            const text = await response.text();
            console.log(`[GET] Réponse brute: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);

            try {
                const data = JSON.parse(text);
                console.log(`[GET] Type de données: ${Array.isArray(data) ? 'Tableau' : typeof data}`);
                if (Array.isArray(data)) {
                    console.log(`[GET] Nombre d'éléments: ${data.length}`);
                }
                return data;
            } catch (e) {
                console.error('[GET] Erreur de parsing JSON:', e);
                return null;
            }
        } catch (error) {
            console.error('[GET] Erreur de requête:', error);
            throw error;
        }
    }

    /**
     * Effectue une requête POST
     */
    static async post(url: string, data: any, headers?: any) {
        console.log(`[POST] Requête vers: ${url}`, data);
        const rHeaders = { ...headers, 'Content-Type': 'application/json' };
        const response = await fetch(url, {
            method: 'POST',
            headers: rHeaders,
            body: JSON.stringify(data)
        });
        console.log(`[POST] Statut de réponse: ${response.status}`);
        const responseData = await response.json();
        console.log('[POST] Données de réponse:', responseData);
        return responseData;
    }

    /**
     * Effectue une requête DELETE
     */
    static async delete(url: string) {
        console.log(`[DELETE] Requête vers: ${url}`);
        const response = await fetch(url, {
            method: 'DELETE'
        });
        console.log(`[DELETE] Statut de réponse: ${response.status}`);

        if (response.status === 204) {
            return true;
        }

        try {
            const responseData = await response.json();
            console.log('[DELETE] Données de réponse:', responseData);
            return responseData;
        } catch (e) {
            // Si pas de contenu JSON, on retourne true
            return true;
        }
    }

    /**
     * Effectue une requête PUT
     */
    static async put(url: string, data: any, headers?: any) {
        console.log(`[PUT] Requête vers: ${url}`, data);
        const rHeaders = { ...headers, 'Content-Type': 'application/json' };
        const response = await fetch(url, {
            method: 'PUT',
            headers: rHeaders,
            body: JSON.stringify(data)
        });
        console.log(`[PUT] Statut de réponse: ${response.status}`);
        const responseData = await response.json();
        console.log('[PUT] Données de réponse:', responseData);
        return responseData;
    }
}