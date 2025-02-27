const postsContainer = document.getElementById('posts-container');

postsContainer.addEventListener('click', (event) => {
    const element = event.target;

    const postContainer = element.closest('.post-container');
    const postId = postContainer.getAttribute('data-post-id');

    window.location.href = `/post/${postId}`;
});