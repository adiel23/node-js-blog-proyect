import { validateUser } from "./modules/authentication.js";

const postSection = document.getElementById('post-section');

const postId = postSection.getAttribute('data-post-id');
const userId = postSection.getAttribute('data-user-id');

const postContent = postSection.getAttribute('data-post-content');

// animacion para el postAuthorDropdown.

let isMouseOverPostAuthorName = false;
let isMouseOverPostAuthorDropdown = false;
let isTimerOn = false;
let isPostAuthorDropdownActive = false;

const postAuthorName = document.getElementById('post-author-name');

const postAuthorDropdown = document.getElementById("post-author-dropdown");

let timer; 

postAuthorName.addEventListener('mouseover', () => {
    isMouseOverPostAuthorName = true;

    if (!isPostAuthorDropdownActive) {
        isTimerOn = true;
        timer = setTimeout(() => {
            isTimerOn = false;
            isPostAuthorDropdownActive = true;
            postAuthorDropdown.style.display = 'block';
        }, 1000);
    };

});

postAuthorName.addEventListener('mouseout', () => {
    isMouseOverPostAuthorName = false;
    if (isTimerOn) {
        clearTimeout(timer);
    } else {
        setTimeout(() => {
            if (!isMouseOverPostAuthorDropdown) {
                isPostAuthorDropdownActive = false;
                postAuthorDropdown.style.display = 'none';
            }
        }, 100);
    };
});

postAuthorDropdown.addEventListener("mouseenter", () => {
    isMouseOverPostAuthorDropdown = true;
});

postAuthorDropdown.addEventListener('mouseleave', () => {
    isMouseOverPostAuthorDropdown = false;
    setTimeout(() => {
        if (!isMouseOverPostAuthorName) {
            isPostAuthorDropdownActive = false;
            postAuthorDropdown.style.display = 'none';
        }
    }, 300);
});

const postAuthorDropdownFollowBtn = document.getElementById('post-author-dropdown-follow-btn');

postAuthorDropdownFollowBtn.addEventListener("click", () => {
    validateUser(() => {
        alert('siguiendo');
    }, userId)
});

const postFollowAuthorBtn = document.getElementById('post-follow-author-btn');

postFollowAuthorBtn.addEventListener('click', () => {
    validateUser(() => {
        alert('siguiendo');
    }, userId)
})

let isCommentTextareaActive = false;

// post stats:

// claps stat

const clapsIcon = document.getElementById('claps-icon');

const clapsCounter = document.getElementById('claps-counter');

clapsIcon.addEventListener('click', () => {
    validateUser(async () => {
        try {
            const serverResponse = await fetch(`http://localhost:3000/posts/${postId}/update-claps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postId,
                    userId
                })
            });
    
            const object = await serverResponse.json();
    
            clapsCounter.textContent = object.claps;

            clapsIcon.style.color = 'blue';
    
        } catch (err) {
            console.log('error al hacer el fetch de claps ' + err);
        }
    }, userId);
});

// comments stat

const commentsCounter = document.getElementById('comments-counter');

let commentsNumber = parseInt(commentsCounter.textContent);

// vamos a hacer la parte de los comentarios.

const commentsSectionTitle = document.getElementById('comments-section-title');

const commentTextarea = document.getElementById('comment-textarea');

const cancelCommentBtn = document.getElementById('cancel-comment-btn');

const addCommentBtn = document.getElementById('add-comment-btn');

const commentsContainer = document.getElementById('comments-container');

commentTextarea.addEventListener('click', () => {
    validateUser(() => {
        if (!isCommentTextareaActive) {
            commentTextarea.style.height = '100px';

            cancelCommentBtn.style.display = 'block';
        }
    }, userId);
});

commentTextarea.addEventListener('input', () => {
    if (commentTextarea.value) {
        addCommentBtn.disabled = false;
        addCommentBtn.classList.add('enabled');
    } else {
        addCommentBtn.disabled = true;
        addCommentBtn.classList.remove('enabled');
    }
});

addCommentBtn.addEventListener('click', () => {
    validateUser(async () => {

        const serverResponse = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content: commentTextarea.value})
        });

        if (serverResponse.ok) {
            const html = await serverResponse.text();

            commentsNumber++;

            updateComments(html);
        };
    }, userId);
});

cancelCommentBtn.addEventListener('click', () => {
    commentTextarea.style.height = '40px';
    commentTextarea.value = '';
    cancelCommentBtn.style.display = 'none';
    addCommentBtn.disabled = true;
    addCommentBtn.classList.remove('enabled');
})

// configuraremos las diferentes eventos que pueden surgir al hacer clic dentro de comments container

asignCommentsEvents();

commentsContainer.addEventListener('click', async (event) => {
    const element = event.target;

    const commentContainer = element.closest('.comment-container');
    const commentId = commentContainer.getAttribute('data-comment-id');

    if (element.classList.contains('comment-like-icon')) {
        validateUser(async () => {
            const userId = commentContainer.getAttribute('data-user-id');
            const likesCountP = commentContainer.querySelector('.comment-likes');

            try {
                const serverResponse = await fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}/likes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        commentId,
                        userId
                    })
                });
                
                const result = await serverResponse.json();

                likesCountP.textContent = result.likes;

                if (result.liked) {
                    element.style.color = 'blue';
                    return;
                }
                element.style.color = 'black';

            } catch (err) {
                console.log('error al hacer el fetch ' + err);
            }
        }, userId);
    } else if (element.classList.contains('delete-comment-btn')) {

        commentToDeleteId = commentId;

        commentDeletionContainer.classList.add('active');
        document.body.classList.add('no-scroll');

    } else if (element.classList.contains('edit-comment-btn')) {

        const commentContainerHTML = commentContainer.innerHTML;

        commentContainer.innerHTML = `
        <div class="comment-editing-container">
            <textarea class="comment-editing-textarea" placeholder="what are your thoughts?"></textarea>

            <div class="comment-editing-container-btns">
                <button class="cancel-comment-editing-btn">
                    Cancel
                </button>
                <button class="update-comment-btn">
                    Update
                </button>
            </div>
        </div>`;

        const commentEditingTextarea = commentContainer.querySelector('.comment-editing-textarea');

        // animacion de habilitar y desabilitar boton
        commentEditingTextarea.addEventListener('input', () => {
            const value = commentEditingTextarea.value.trim();
            if (value == '') {
                if (updateCommentBtn.classList.contains('enabled')) {
                    updateCommentBtn.classList.remove("enabled");
                }
            } else {
                if (!updateCommentBtn.classList.contains('enabled')) {
                    updateCommentBtn.classList.add('enabled');
                }
            }
        });

        const updateCommentBtn = commentContainer.querySelector('.update-comment-btn');

        updateCommentBtn.addEventListener('click', async () => {
            try {

                console.log(commentEditingTextarea.value);

                const response = await fetch(`/posts/${postId}/comments/${commentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {content: commentEditingTextarea.value}
                    )
                });

                const renderedCommentsHTML = await response.text();

                updateComments(renderedCommentsHTML);

            } catch (err) {
                console.log('error al hacer clic en el boton para actualizar comentario');
            }
        });

        const cancelCommentEditingBtn = commentContainer.querySelector('.cancel-comment-editing-btn');

        cancelCommentEditingBtn.addEventListener('click', () => {
            commentContainer.innerHTML = commentContainerHTML;
        });

    } else if (element.classList.contains('comment-dropdown-toggler')) {
        const commentDropdown = element.nextElementSibling;

        commentDropdown.classList.toggle('active');
    } else if (element.classList.contains('comment-author-name')) {
        const authorId = commentContainer.getAttribute("data-comment-author-id");
        window.location.href = `/authors/${authorId}`;
    } else if (element.classList.contains('comment-author-dropdown-follow-btn')) {
        validateUser(() => {
            alert('following');
        }, userId)
    }
});

// overlay y mas

const commentDeletionContainer = document.getElementById('comment-deletion-container');

const cancelCommentDeletionBtn = document.getElementById('cancel-comment-deletion-btn');

cancelCommentDeletionBtn.addEventListener('click', () => {
    hideCommentDeletionContainer();
});

let commentToDeleteId;

const deleteCommentBtn = document.getElementById('delete-comment-btn');

deleteCommentBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${commentToDeleteId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            hideCommentDeletionContainer();

            const html = await response.text();

            commentsNumber--;

            updateComments(html);
        }

    } catch (err) {
        console.log('error en el fetch para eliminar el comentario: ' + err);
    };
});

async function updateComments(html) {

    commentsContainer.innerHTML = html;

    commentTextarea.value = '';

    commentsCounter.textContent = commentsNumber;

    commentsSectionTitle.textContent = `Comments (${commentsNumber})`;

    asignCommentsEvents(); // reasignamos los eventos a cada comentario
}

function hideCommentDeletionContainer() {
    commentDeletionContainer.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

let isMouseOverCommentAuthorDropdown;
let isMouseOverCommentAuthorName;
let isCommentAuthorDropdownActive;

function asignCommentsEvents() {
    document.querySelectorAll(".comment-author-name").forEach(p => {
        const commentContainer = p.closest('.comment-container');

        const authorDropdown = commentContainer.querySelector('.comment-author-dropdown');

        p.addEventListener("mouseover", () => {
            isMouseOverCommentAuthorName = true;

            if (!isCommentAuthorDropdownActive) {
                isCommentAuthorDropdownActive = true;
                authorDropdown.style.display = 'flex';
            }
        });

        p.addEventListener('mouseout', () => {
            isMouseOverCommentAuthorName = false;

            setTimeout(() => {
                if (!isMouseOverCommentAuthorDropdown) {
                    isCommentAuthorDropdownActive = false;
                    authorDropdown.style.display = 'none';
                }
            }, 300);
        })

        authorDropdown.addEventListener('mouseenter', () => {
            isCommentAuthorDropdownActive = true;
            isMouseOverCommentAuthorDropdown = true;
        });

        authorDropdown.addEventListener('mouseleave', () => {
            isMouseOverCommentAuthorDropdown = false;

            setTimeout(() => {
                if (!isMouseOverCommentAuthorName) {
                    isCommentAuthorDropdownActive = false;
                    authorDropdown.style.display = 'none';
                };
            }, 300);
        });

    });
}
