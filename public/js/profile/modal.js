import {showModal, hideModal} from '../utils.js';

export function setupModalControls() {
    const profileSettingsModal = document.getElementById('profile-settings-modal');
    
    const overlay = document.getElementById('overlay');
    
    const showProfileSettingsModalBtn = document.getElementById('show-profile-settings-modal-btn');
    
    showProfileSettingsModalBtn.addEventListener('click', () => {
        showModal(profileSettingsModal, overlay, 'flex');
    });
    
    const closeProfileSettingsModalBtn = document.getElementById('close-profile-settings-modal-btn');
    
    closeProfileSettingsModalBtn.addEventListener('click', () => {
        hideModal(profileSettingsModal, overlay);
    });
}