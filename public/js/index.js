console.log('xd');

let isMouseOverDropdown = false;
let isMouseOverAuthorName = false;

const p = document.getElementById('xd');

const postAuthorSections = document.querySelectorAll('.post-author-section');

if (postAuthorSections.length > 0) {
    postAuthorSections.forEach(section => {
        const authorImg = section.querySelector('.author-img');
        const authorName = section.querySelector('.author-name');
        const dropdown = section.querySelector('.author-dropdown');

        authorName.addEventListener('mouseover', () => {
            console.log('estas haciendo over sobre authorName');
            isMouseOverAuthorName = true;
            dropdown.style.display = 'block';
        });

        authorName.addEventListener('mouseout', () => {
            console.log("has dejado de hacer over sobre authorName");
            isMouseOverAuthorName = false;
            setTimeout(() => {
                if (!isMouseOverDropdown) {
                    dropdown.style.display = 'none';
                };
            }, 100);
        });

        dropdown.addEventListener("mouseenter", () => {
            console.log('estas haciendo over sobre el dropdown');
            isMouseOverDropdown = true;
        });

        dropdown.addEventListener('mouseleave', () => {
            console.log('has dejado de hacer over sobre el dropdown');
            isMouseOverDropdown = false;
            setTimeout(() => {
                if (!isMouseOverAuthorName) {
                    dropdown.style.display = 'none';
                };
            }, 100);
        });

    });
};