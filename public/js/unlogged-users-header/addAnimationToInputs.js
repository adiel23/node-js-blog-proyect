export function addAnimationToLoginFormInputs() {
    const inputs = document.getElementById('login-form').querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.add('active');
        });

        input.addEventListener('blur', () => {
            input.classList.remove('active');
        });
    });
}