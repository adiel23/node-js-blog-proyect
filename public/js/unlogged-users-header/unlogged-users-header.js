import { addAnimationToLoginFormInputs } from "./addAnimationToInputs.js";
import { handleImgInputChange } from "./registerForm.js";
import { setupFormsVisibilityBtns } from "./showOrHideForms.js";

// esta parte se encarga de mostrar u ocultar los formularios

setupFormsVisibilityBtns();

// agregar animacion chingona a todos los input.

// const forms = document.querySelectorAll('.login-form');

// const loginForm = forms[0];

// const inputs = Array.from(loginForm.querySelectorAll('input'));

// inputs.forEach(input => {
//     input.addEventListener('focus', () => {
//         input.classList.add('active');
//     });

//     input.addEventListener('blur', () => {
//         input.classList.remove('active');
//     });
// });

addAnimationToLoginFormInputs();

// manejo del login

// esto es del register

handleImgInputChange();

// esto es del login

const loginEmailInput = inputs[0];
const loginPasswordInput = inputs[1];

const loginBtn = document.getElementById('login-btn');

const loginErrorMessage = document.getElementById('login-error-message');

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (loginEmailInput.value == '' || loginPasswordInput.value == '') {
        loginErrorMessage.textContent = 'Completa todos los campos';
    } else {
        const response = await fetch(`http://localhost:3000/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginEmailInput.value,
                password: loginPasswordInput.value
            })
        });

        if (response.ok) {
            window.location.href = '/home/'
        } else {
            const parsedResponse = await response.json();
            
            loginErrorMessage.textContent = parsedResponse.message;
        }
    }

    
});


