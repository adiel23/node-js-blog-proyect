export function setupSearchEvents(searchIcon, searchInput) {

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
}



