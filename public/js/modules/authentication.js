export function validateUser(callback, userId) {
    if (userId) {
        callback();
    } else {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('login-form').style.display = 'flex';
        document.body.classList.add('no-scroll');
    }
}