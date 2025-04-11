const userId = document.body.getAttribute('data-user-id');

let userChanges = {};

fetch('http://localhost:3000/user/without-posts')
.then(response => response.json())
.then(user => {
    console.log(user);
})
.catch(err => {
    console.error('error al obtener los datos en el fetch a getUserWithoutPosts ' + err);
});

const postsContainer = document.getElementById('posts-container');

postsContainer.addEventListener('click', (event) => {
    const element = event.target;

    if (element.classList.contains('remove-post-btn')) {

        const postId = element.getAttribute('data-post-id');

        (async () => {
            try {
                const response = await fetch(`http://localhost:3000/post/${postId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const renderedHTML = await response.text();

                    updatePostsContainer(renderedHTML);
                    return;
                };

                console.log('error en la respuesta del server');
            } catch (err) {
                console.log('error en la funcion asincrona autoejecutable al dar clic en el remove post btn ' + err)
            }
        })();

    } else if (element.classList.contains('post-dropdown-toggler')) {
        const postDropdown = element.nextElementSibling;

        postDropdown.classList.toggle('active');

    } else if (!element.classList.contains('edit-post-btn')) {
        const postContainer = element.closest('.post-container');
        const postId = postContainer.getAttribute('data-post-id');
        window.location.href = `/post/${postId}`;
    }

});

function updatePostsContainer(renderedHTML) {
    postsContainer.innerHTML = renderedHTML;
}

// vamos con lo de la ventana modal

const showProfileSettingsModalBtn = document.getElementById('show-profile-settings-modal-btn');

const profileSettingsModal = document.getElementById('profile-settings-modal');

const overlay = document.getElementById('overlay');

showProfileSettingsModalBtn.addEventListener('click', () => {
    profileSettingsModal.style.display = 'flex';
    overlay.style.display = 'block';
});

const closeProfileSettingsModalBtn = document.getElementById('close-profile-settings-modal-btn');

closeProfileSettingsModalBtn.addEventListener('click', () => {
    profileSettingsModal.style.display = 'none';
    overlay.style.display = 'none';
});

const saveProfileChangesBtn = document.getElementById("save-profile-changes-btn");

saveProfileChangesBtn.addEventListener('click', async () => {
    const formData = new FormData();

    if (userChanges.imagePath) {
        formData.append('imagePath', userChanges.imagePath);
    }
    if (userChanges.name) {
        formData.append('name', userChanges.name);
    }
    if (userChanges.bio) {
        formData.append('bio', userChanges.bio)
    };

    const result = await fetch(`http://localhost:3000/user/${userId}/profile`, {
        method: 'PATCH',
        body: formData
    });

    if (result.ok) {
        window.location.href = 'http://localhost:3000/user/profile';
    };

});

// vamos con los botones funcionales de la ventana modal.

const profilePhotoInput = document.getElementById('profile-photo-input');

const openProfilePhotoInputBtn = document.getElementById('open-profile-photo-input-btn');

openProfilePhotoInputBtn.addEventListener('click', () => {
    profilePhotoInput.click();
});

profilePhotoInput.addEventListener('change', (event) => {
    console.log(event.target.files);

    const file = event.target.files[0];

    if (file) {
        userChanges.imagePath = file;

        console.log(file);

        // const reader = new FileReader();

        // reader.onload = function (e) {
        //     userChanges.imagePath = e.target.result;
        // };

        // reader.readAsDataURL(file);
    }
});

const profileSettingsNameInput = document.getElementById('profile-settings-name-input');

profileSettingsNameInput.addEventListener('input', () => {
    userChanges.name = profileSettingsNameInput.value;
});

const profileSettingsBioInput = document.getElementById('profile-settings-bio-input');

profileSettingsBioInput.addEventListener('input', () => {
    userChanges.bio = profileSettingsBioInput.value;
})


