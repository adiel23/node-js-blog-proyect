import {validateUser} from './modules/authentication.js';

const reportPostModalOverlay = document.getElementById('report-post-modal-overlay');

const reportPostModal = document.getElementById('report-post-modal');

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

let postToReportId;

postsContainer.addEventListener('click', (event) => {
    const element = event.target;

    if (element.classList.contains('open-report-post-modal-btn')) {
        
        validateUser(()=> {
            (async () => {
                const post = element.closest('.post-container');
                postToReportId = post.getAttribute('data-post-id');

                try {
                    const hasReportedPost = await verifyReportedPost(postToReportId);

                    if (!hasReportedPost) {
                    
                        reportPostModalOverlay.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                        reportPostModal.style.display = 'flex';
                    } else {
                        alert('ya ha reportado este post');
                    }

                } catch (err) {
                    console.log('error en la funcion autoejecutable dentro de open-report-post-modal: ' + err)
                }
                
            })();

        }, userId);

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

const reportPostForm = document.getElementById('report-post-form');

const reportPostBtn = document.getElementById('report-post-btn');

let reportReason;

let alreadyActivated = false;

reportPostForm.addEventListener('change', (e) => {
    if (e.target.name == 'report-reason') {
        reportReason = e.target.value;
        if (!alreadyActivated) {
            reportPostBtn.disabled = false;
        }
    }
});

const reportMessage = document.getElementById('report-message');

reportPostBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`/post/${postToReportId}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reportReason: reportReason
            })
        });

        if (response.ok) {
            reportMessage.textContent = 'reporte enviado';

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }

        const data = await response.json();

        console.log('fetch exitoso ' + data);
    } catch (err) {
        console.log('error al hacer clic el boton de reportar post ' + err);
    }
    
});

const closeReportPostModalBtn = document.getElementById('close-report-post-modal-btn');

closeReportPostModalBtn.addEventListener('click', () => {
    reportPostModalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    reportPostModal.style.display = 'none';
});

async function verifyReportedPost(postId) {
    const response = await fetch(`/user/has-reported-post?postId=${postId}`);

    const data = await response.json();
    
    console.log(data);

    if (data.hasReportedPost) {
        return true;
    }
    return false;
}

const followAuthorBtn = document.getElementById('follow-author-btn');

followAuthorBtn.addEventListener('click', () => {
    validateUser(() => {
    }, userId)
});

