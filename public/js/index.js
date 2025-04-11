import { validateUser } from "./modules/authentication.js";

const userId = document.body.getAttribute('data-user-id');

// variables para la animacion al hacer hover sobre el nombre del author

let isMouseOverDropdown = false;
let isMouseOverAuthorName = false;

const postAuthorSections = document.querySelectorAll('.post-author-section');

if (postAuthorSections.length > 0) {
    postAuthorSections.forEach(section => {
        const authorName = section.querySelector('.author-name');
        const dropdown = section.querySelector('.author-dropdown');

        authorName.addEventListener('mouseover', () => {
            isMouseOverAuthorName = true;
            dropdown.style.display = 'block';
        });

        authorName.addEventListener('mouseout', () => {
            isMouseOverAuthorName = false;
            setTimeout(() => {
                if (!isMouseOverDropdown) {
                    dropdown.style.display = 'none';
                };
            }, 100);
        });

        dropdown.addEventListener("mouseenter", () => {
            isMouseOverDropdown = true;
        });

        dropdown.addEventListener('mouseleave', () => {
            isMouseOverDropdown = false;
            setTimeout(() => {
                if (!isMouseOverAuthorName) {
                    dropdown.style.display = 'none';
                };
            }, 100);
        });
        
        const followAuthorBtn = dropdown.querySelector('.follow-author-btn');

        followAuthorBtn.addEventListener('click', () => {
            validateUser(() => {
                alert('hello')
            }, userId);
        });

    });
};