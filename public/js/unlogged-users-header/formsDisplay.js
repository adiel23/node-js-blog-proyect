export function setupFormsVisibilityBtns(overlayId) {
    const overlay = document.getElementById(overlayId);

    const btns = document.querySelectorAll('[data-modal-target][data-modal-action]');

    btns.forEach(btn => {
        const modalId = btn.getAttribute('data-modal-target');
        const action = btn.getAttribute('data-modal-action');
        btn.addEventListener('click', () => {
            if (action == 'open') {
                showModal(modalId, overlay);
            } else {
                hideModal(modalId, overlay);
            }
        })
    });

}

function showModal(modalId, overlay) {
    const modal = document.getElementById(modalId);

    modal.style.display = 'flex';
    overlay.style.display = 'block';
    document.body.classList.add('no-scroll');

}

// esto se encarga de ocultar el formulario

function hideModal(modalId, overlay) {
    const modal = document.getElementById(modalId);

    modal.style.display = 'none';
    overlay.style.display = 'none';
    document.body.classList.remove('no-scroll');
}