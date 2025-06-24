import { getUserData, setUserData } from "./states.js";
import { getUser } from "../services/userService.js";

export function addUserChangesToFormData(userChanges, formData) {
    if (userChanges.imagePath) {
        formData.append('imagePath', userChanges.imagePath);
    }
    if (userChanges.name) {
        formData.append('name', userChanges.name);
    }
    if (userChanges.bio) {
        formData.append('bio', userChanges.bio)
    };
}

export async function checkForChanges(nameInput, bioInput, saveBtn) {
    if (!getUserData()) {
        try {
            const response = await getUser();

            const data = await response.json();

            setUserData(data.user);

            return;
        } catch (err) {
            console.error('error en getUser: ', err);
        }
    }

    const currentUser = getUserData();
    const nameChanged = nameInput.value !== currentUser.name;
    const bioChanged = bioInput.value !== currentUser.bio;

    if (nameChanged || bioChanged) {
        saveBtn.disabled = false;
    } else {
        saveBtn.disabled = true;
    }
}