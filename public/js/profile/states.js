export const userChanges = {};

let userData = null;

export function setUserData(newData) {
    userData = newData;
}

export function getUserData() {
    return userData;
}