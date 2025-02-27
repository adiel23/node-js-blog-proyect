const postSection = document.getElementById('post-section');

const postId = postSection.getAttribute('data-post-id');
const userId = postSection.getAttribute('data-user-id');
const postContent = postSection.getAttribute('data-post-content');

// vamos con la parte del dropdown 

let isMouseOverPostAuthorName = false;
let isMouseOverPostAuthorDropdown = false;

const postAuthorName = document.getElementById('post-author-name');

const postAuthorDropdown = document.getElementById("post-author-dropdown");

postAuthorName.addEventListener('mouseover', () => {
    postAuthorDropdown.style.display = 'block';
})







let isCommentTextareaActive = false;

// post stats:

// claps stat

const clapsIcon = document.getElementById('claps-icon');

const clapsCounter = document.getElementById('claps-counter');

clapsIcon.addEventListener('click', () => {
    validateUser(async () => {
        try {
            const serverResponse = await fetch(`http://localhost:3000/post/${postId}/update-claps`, {
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
    });
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
    });
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

        const serverResponse = await fetch(`http://localhost:3000/post/${postId}/comments`, {
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
    });
});

cancelCommentBtn.addEventListener('click', () => {
    commentTextarea.style.height = '40px';
    commentTextarea.value = '';
    cancelCommentBtn.style.display = 'none';
    addCommentBtn.disabled = true;
    addCommentBtn.classList.remove('enabled');
})

// ahora vamos a hacer lo de los likes de los comentarios.

commentsContainer.addEventListener('click', async (event) => {
    validateUser(async () => {
        const element = event.target;

        if (element.classList.contains('comment-like-icon')) {
            const commentContainer = element.closest('.comment-container');
            const commentId = commentContainer.getAttribute('data-comment-id');
            const userId = commentContainer.getAttribute('data-user-id');
            const likesCountP = commentContainer.querySelector('p');

            try {
                const serverResponse = await fetch(`http://localhost:3000/post/${postId}/comments/${commentId}/likes`, {
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
            };
        } else if (element.classList.contains('delete-comment-btn')) {
            const commentContainer = element.closest('.comment-container'); // el ancestro mas cercano que cumple con el selector especificado.

            const commentId = commentContainer.getAttribute('data-comment-id');

            commentToDeleteId = commentId;

            overlay.style.display = 'block';
            commentDeletionContainer.style.display = 'block';
            document.body.classList.add('no-scroll');

        } else if (element.classList.contains('edit-comment-btn')) {
            const commentContainer = element.closest('.comment-container');

            const commentId = commentContainer.getAttribute('data-comment-id');

            const commentContainerHTML = commentContainer.innerHTML;

            commentContainer.innerHTML = `
            <div class="comment-editing-container">
                <textarea class="comment-editing-textarea"></textarea>

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

            const updateCommentBtn = commentContainer.querySelector('.update-comment-btn');

            updateCommentBtn.addEventListener('click', async () => {
                try {

                    console.log(commentEditingTextarea.value);

                    const response = await fetch(`/post/${postId}/comments/${commentId}`, {
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
        }
    });
});

// overlay y mas

const overlay = document.getElementById('overlay');

const commentDeletionContainer = document.getElementById('comment-deletion-container');

const cancelCommentDeletionBtn = document.getElementById('cancel-comment-deletion-btn');

cancelCommentDeletionBtn.addEventListener('click', () => {
    hideCommentDeletionContainer();
});

let commentToDeleteId;

const deleteCommentBtn = document.getElementById('delete-comment-btn');

deleteCommentBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`http://localhost:3000/post/${postId}/comments/${commentToDeleteId}`, {
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

const validateUser = (callback) => {
    if (userId) {
        callback()
    } else {
        window.location.href = '/';
    }
}

async function updateComments(html) {

    commentsContainer.innerHTML = html;

    commentTextarea.value = '';

    commentsCounter.textContent = commentsNumber;

    commentsSectionTitle.textContent = `Comments (${commentsNumber})`;
}

function hideCommentDeletionContainer() {
    overlay.style.display = 'none';
    commentDeletionContainer.style.display = 'none';
    document.body.classList.remove('no-scroll');
}
