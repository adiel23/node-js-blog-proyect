import { setupProfileDropdown } from "./profile-dropdown.js";
import { setupSearchEvents } from "./search.js";

const searchIcon = document.getElementById('search-icon');

const searchInput = document.getElementById('search-input');

setupSearchEvents(searchIcon, searchInput); // se encarga de crear los eventos relacionados con la busqueda.

// animation del profile

setupProfileDropdown(); // se encarga de activar los eventos y funcionalidades relacionadas con el dropdown del perfil
