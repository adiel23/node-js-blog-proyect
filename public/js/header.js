const searchIcon = document.getElementById('search-icon');

const searchInput = document.getElementById('search-input');

searchIcon.addEventListener('click', () => {
    searchInput.classList.toggle('active');
});

searchInput.addEventListener('keydown', (event) => {
    console.log(event.key);
    if (event.key == 'Enter') {
        const query = searchInput.value.replace(' ', '+');
        
        window.location.href = `/post/matches?q=${query}`;
    };
});

// animation del profile

const profileDropdownContainer = document.getElementById('profile-dropdown-container');

const profileDropdownToggler = document.getElementById('profile-dropdown-toggler');

const profileDropdown = document.getElementById('profile-dropdown');

profileDropdownToggler.addEventListener('click', () => {
    profileDropdown.classList.toggle('active');
});

// animacion de ajustamiento del dropdown

const pathname = window.location.pathname;

if (pathname == '/') {
    function updateForHome() {
        const windowWidth = window.innerWidth;
    
        if (windowWidth >= 1200) {
            changeProfileDropdownLeftToNormal()
        } else {
            changeProfileDropdownLeftDinamic()
        }
    }

    updateForHome();

    window.addEventListener('resize', updateForHome);
   
} else {
    function updateForOtherPaths() {
        changeProfileDropdownLeftDinamic();
    }

    updateForOtherPaths();

    window.addEventListener('resize', updateForOtherPaths);
}

function changeProfileDropdownLeftToNormal() {
    profileDropdown.style.left = '50%';
    profileDropdown.style.transform = 'translateX(-50%)';
}

function changeProfileDropdownLeftDinamic() {
    const windowWidth = window.innerWidth;

    const profileDropdownContainerRect = profileDropdownContainer.getBoundingClientRect();

    const distance = windowWidth - profileDropdownContainerRect.left;

    console.log(distance);

    const left = distance - 230;

    console.log(left);

    profileDropdown.style.left = `${left}px`;
    profileDropdown.style.transform = 'none';
}

const logOutLink = document.getElementById('log-out-link');
