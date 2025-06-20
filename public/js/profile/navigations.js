import { endpoints } from "../config.js";

export function redirectToPost(id) {
    window.location.href = endpoints.posts.get(id);
}