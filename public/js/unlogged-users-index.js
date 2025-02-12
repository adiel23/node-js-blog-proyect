const overlay = document.getElementById('overlay');

document.getElementById("show-login-form-btn").addEventListener('click', () => {
    showModal('login-form');
});

document.getElementById('close-login-form-btn').addEventListener('click', () => {
    hideModal('login-form');
})

document.getElementById('show-register-form-btn').addEventListener('click', () => {
    showModal('register-form');
});

document.getElementById('close-register-form-btn').addEventListener('click', () => {
    hideModal('register-form');
});

function showModal(modalId) {
    const modal = document.getElementById(modalId);

    modal.style.display = 'flex';
    overlay.style.display = 'block';
    document.body.classList.add('no-scroll');

}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);

    modal.style.display = 'none';
    overlay.style.display = 'none';
    document.body.classList.remove('no-scroll');
}

// agregar animacion chingona a todos los input.

const inputs = Array.from(document.querySelectorAll('input')).filter(input => input.id != 'img-input');

inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.classList.add('active');
    });

    input.addEventListener('blur', () => {
        input.classList.remove('active');
    });
});

const imgPreview = document.getElementById('img-preview');

const imgInput = document.getElementById('img-input');

imgInput.addEventListener('change', async (event) => {
    const file = event.target.files[0]
    console.log(file);

    let imageUrl;

    const fileReader = new FileReader();

    fileReader.onload = event => {
        imageUrl = event.target.result;
        imgPreview.src = imageUrl;
    };

    fileReader.readAsDataURL(file);

})


