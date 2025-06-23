export function showModal(modal, overlay, display) {
    modal.style.display = display;
    overlay.style.display = 'block';
}

export function hideModal(modal, overlay) {
    modal.style.display = 'none';
    overlay.style.display = 'none';
}

export function redirect(url) {
    window.location.href = url;
}

export function updateContainerHTML(container, renderedHTML) {
    container.innerHTML = renderedHTML;
}

export function toggleDropdown(dropdown) {
    dropdown.classList.toggle('active');
}