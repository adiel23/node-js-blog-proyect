import { API_BASE_URL, endpoints} from "../config.js";

export async function deletePost(id) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoints.posts.delete(id)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            console.error('respuesta no exitosa: ', response.status);
            return;
        };

        const renderedHTML = await response.text();

        return renderedHTML;

    } catch (err) {
        console.log('error en la funcion deletePost: ', err);
    }
}