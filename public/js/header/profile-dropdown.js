export function setupProfileDropdown() {
    const profileDropdownContainer = document.getElementById('profile-dropdown-container');

    const profileDropdownToggler = document.getElementById('profile-dropdown-toggler');

    const profileDropdown = document.getElementById('profile-dropdown');

    setupDropdownToggle(profileDropdownToggler, profileDropdown);

    // animacion de ajustamiento del dropdown

    const pathname = window.location.pathname;

    setupDropdownPositioning(pathname, profileDropdownContainer, profileDropdown);

}

function setupDropdownToggle(toggler, dropdown) {
    toggler.addEventListener('click', () => {
        dropdown.classList.toggle('active');
    });
}

function setupDropdownPositioning(pathname, dropdownContainer, dropdown) {

    function changeToCenter() {
        dropdown.style.left = '50%';
        dropdown.style.transform = 'translateX(-50%)';
    }

    function changeToDynamic() {
        const windowWidth = window.innerWidth;

        const profileDropdownContainerRect = dropdownContainer.getBoundingClientRect();

        const distance = windowWidth - profileDropdownContainerRect.left;

        const left = distance - 230;

        dropdown.style.left = `${left}px`;
        dropdown.style.transform = 'none';
    }

    const updatePosition = () => {
        if (pathname === '/home' && window.innerWidth >= 1200) {
            changeToCenter();
        } else {
            changeToDynamic();
        }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
}