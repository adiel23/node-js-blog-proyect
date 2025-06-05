const postContainers = document.querySelectorAll('.post-container');

if (postContainers.length > 0) {
    postContainers.forEach(container => {
        container.addEventListener("click", () => {
            const postId = container.getAttribute('data-post-id');

            window.location.href = `/posts/${postId}`;
        })
    })
}