// le agrega una animacion a cada uno de los input del formulario de login.

export function addAnimationToLoginFormInputs(formId) {
    const inputs = document.getElementById(formId).querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.add('active');
        });

        input.addEventListener('blur', () => {
            input.classList.remove('active');
        });
    });
}