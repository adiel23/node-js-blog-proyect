import { API_BASE_URL, endpoints } from "../config.js";

export async function updateUser(id, newData) {
    return await fetch(`${API_BASE_URL}${endpoints.users.update(id)}`, {
        method: 'PATCH',
        body: newData
    });
}

export async function getUser() {
    return await fetch(`${API_BASE_URL}${endpoints.users.get}`);
}