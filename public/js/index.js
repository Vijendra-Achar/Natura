// All Imports
import '@babel/polyfill';
import { login, logout, signup } from './auth';
import { displayMap } from './mapbox';

// DOM Elements
const map = document.getElementById('map');
const loginForm = document.querySelector('#loginForm');
const signupForm = document.querySelector('#signupForm');
const logOutBtn = document.querySelector('.nav__el--logout');

// DELEGATION
// Get the Map Locations and call the displayMap Function
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

// Getting the Signup details, creating a new user and logging them in directly
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

// Getting the Login Credentials form the user and logging the user in
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

// Logout User
if (logOutBtn) logOutBtn.addEventListener('click', logout);
