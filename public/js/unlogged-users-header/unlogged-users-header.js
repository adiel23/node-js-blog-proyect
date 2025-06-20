import { addAnimationToLoginFormInputs } from "./inputsAnimations.js";
import { handleLogin } from "./loginHandler.js";
import { handleImgInputChange } from "./imagePreview.js";
import { setupFormsVisibilityBtns } from "./formsDisplay.js";

// esta parte se encarga de mostrar u ocultar los formularios

setupFormsVisibilityBtns('overlay'); // programamos los botones de mostrar y ocultar el formulario

addAnimationToLoginFormInputs('login-form');

handleImgInputChange('img-preview', 'img-input');

handleLogin('login-form', 'login-btn', 'login-error-message');


