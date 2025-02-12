console.log('xd')

const p = document.getElementById('xd');

const postAuthorSections = document.querySelectorAll('.post-author-section');

if (postAuthorSections.length > 0) {
    postAuthorSections.forEach(section => {
        const dropdown = section.querySelector('.author-dropdown');

        section.addEventListener('mouseenter', () => {
            
            dropdown.style.display = 'block';

            const sectionRect = section.getBoundingClientRect();

            const dropdownRect = dropdown.getBoundingClientRect();

            if (sectionRect.top > dropdownRect.height + 70) {

                // p.textContent = 'el dropdown tiene espacio para mostrarse arriba asi que se mostrara arriba'
                
                dropdown.style.top = `-${dropdownRect.height}px`;

                dropdown.classList.add('up');

            } else {
                // p.textContent = 'el dropdown no tiene espacio para mostrarse arriba asi que se mostrara abajo.'

                dropdown.style.top = '56px';

                dropdown.classList.add('down');
            }

        });

        section.addEventListener('mouseleave', () => {
            dropdown.style.display = 'none';
            
            if (dropdown.classList.contains('up')) {
                dropdown.classList.remove('up');
            } else {
                dropdown.classList.remove('down');
            }
        });

    })
}