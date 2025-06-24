export function handleLogin(formId, loginBtnId, loginErrorMessageId) {
    const inputs = document.getElementById(formId).querySelectorAll('input');

    const loginEmailInput = inputs[0];
    const loginPasswordInput = inputs[1];

    const loginBtn = document.getElementById(loginBtnId);

    const loginErrorMessage = document.getElementById(loginErrorMessageId);

    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        if (loginEmailInput.value == '' || loginPasswordInput.value == '') {
            loginErrorMessage.textContent = 'Completa todos los campos';
        } else {
            const response = await loginRequest(loginEmailInput, loginPasswordInput);

            if (response.ok) {
                window.location.href = '/home/';
            } else {
                const parsedResponse = await response.json();
                
                loginErrorMessage.textContent = parsedResponse.message;
            }
        }

    });
}

async function loginRequest(emailInput, passwordInput) {
    try {
        const response = await fetch(`http://localhost:3000/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value
            })
        });

        return response;
    } catch (err) {
        console.log('error en la funcion loginRequest: ', err);
    }
}