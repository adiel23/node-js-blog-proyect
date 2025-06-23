import { API_BASE_URL, endpoints} from "../config.js";
import { userChanges } from "./states.js";
import {deletePost} from '../services/postService.js';
import { updateContainerHTML, toggleDropdown, redirect} from "../utils.js";
import { checkForChanges, addUserChangesToFormData} from "./form.js";
import { updateUser } from "../services/userService.js";

export function setUpEventListeners() {
    const postsContainer = document.getElementById('posts-container');
    
    postsContainer.addEventListener('click', async (event) => {
        const element = event.target;
    
        if (element.classList.contains('remove-post-btn')) {
    
            const postId = element.getAttribute('data-post-id');
    
            const renderedHTML = await deletePost(postId);
    
            updateContainerHTML(postsContainer, renderedHTML);
    
        } else if (element.classList.contains('post-dropdown-toggler')) {
            const postDropdown = element.nextElementSibling;
    
            toggleDropdown(postDropdown);
    
        } else if (!element.classList.contains('edit-post-btn')) {
            const postContainer = element.closest('.post-container');
            const postId = postContainer.getAttribute('data-post-id');
    
            redirect(`${API_BASE_URL}${endpoints.posts.get(postId)}`); // redireccionar a la pagina del post
        }
    
    });

    const openProfilePhotoInputBtn = document.getElementById('open-profile-photo-input-btn');

    openProfilePhotoInputBtn.addEventListener('click', () => {
        profilePhotoInput.click();
    });

    const profilePhotoInput = document.getElementById('profile-photo-input');

    profilePhotoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            userChanges.imagePath = file;
        }
    });

    const profileSettingsNameInput = document.getElementById('profile-settings-name-input');

    profileSettingsNameInput.addEventListener('input', async () => {
        userChanges.name = profileSettingsNameInput.value;
        await checkForChanges(profileSettingsNameInput, profileSettingsBioInput, saveProfileChangesBtn);
    });

    const profileSettingsBioInput = document.getElementById('profile-settings-bio-input');

    profileSettingsBioInput.addEventListener('input', async () => {
        userChanges.bio = profileSettingsBioInput.value;
        await checkForChanges(profileSettingsNameInput, profileSettingsBioInput, saveProfileChangesBtn);
    });

    const saveProfileChangesBtn = document.getElementById("save-profile-changes-btn");

    const userId = document.body.getAttribute('data-user-id');

    saveProfileChangesBtn.addEventListener('click', async () => {
        const formData = new FormData();

        addUserChangesToFormData(userChanges, formData);

        try {
            const result = await updateUser(userId, formData);

            if (result.ok) {
                redirect(`${API_BASE_URL}/users/profile`);
            };
        } catch (err) {
            console.error('error al hacer clic en el boton de guardar cambios del perfil: ', err);
        }

    });
}