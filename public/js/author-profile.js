import {validateUser} from './modules/authentication.js';

const reportPostModalOverlay = document.getElementById('report-post-modal-overlay');

const container = document.getElementById('container');

const userId = container.getAttribute('data-user-id');

// animacion fachera de cambiar el contenido del main.

const home = document.getElementById('home');
const about = document.getElementById('about');

const homeContent = document.getElementById('home-content');
const aboutContent = document.getElementById('about-content');

const savedTab = localStorage.getItem('activeTab');

if (savedTab) {
    setActiveTab(savedTab)
} else {
    setActiveTab('home')
}

home.addEventListener('click', () => {
    setActiveTab('home');
});

about.addEventListener('click', () => {
    setActiveTab('about');
});

function setActiveTab(id) {
    localStorage.setItem('activeTab', id);
    home.classList.remove('active');
    about.classList.remove('active');
    document.getElementById(id).classList.add('active');

    homeContent.classList.remove('active');
    aboutContent.classList.remove('active');

    document.getElementById(`${id}-content`).classList.add('active')

}

// posts container

const postsContainer = document.getElementById('posts-container');

postsContainer.addEventListener('click', (event) => {
    const element = event.target;

    if (element.classList.contains('open-report-post-modal-btn')) {
        reportPostModalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

    } else if (element.classList.contains('close-report-post-modal')){
        reportPostModalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        
    } else if (element.classList.contains('post-dropdown-toggler')) {
        const postOptions = element.closest('.post-options');
        const postDropdown = postOptions.querySelector('.post-dropdown');

        postDropdown.classList.toggle('active');
        
    } else if(element.classList.contains('save-post-icon')) {
        alert('xd');
    } else {

        const postContainer = element.closest('.post-container');

        console.log(postContainer);

        const postId = postContainer.getAttribute('data-post-id');

        window.location.href = `/post/${postId}`;
        
    }

    
});

const followAuthorBtn = document.getElementById('follow-author-btn');

followAuthorBtn.addEventListener('click', () => {
    validateUser(() => {
    }, userId)
});

