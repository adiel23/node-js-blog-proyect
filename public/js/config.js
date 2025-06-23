export const API_BASE_URL = 'http://localhost:3000';

export const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register'
    },
    posts: {
        delete: (id) => `/posts/${id}`,
        get: (id) => `/posts/${id}`
    },
    users: {
        update: (id) => `/users/${id}`,
        get: '/users'
    }
};