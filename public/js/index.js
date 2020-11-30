// All Imports
import '@babel/polyfill';
import { login, logout, signup } from './auth';
import { displayMap } from './mapbox';
import { bookTour } from './stripe';
import { updateInfo, updatePassword } from './accountSettings';

// DOM Elements
const map = document.getElementById('map');

const loginForm = document.querySelector('#loginForm');
const updateUserDataForm = document.querySelector('#updateUserData');
const updatePasswordForm = document.querySelector('#updatePassword');

const signupForm = document.querySelector('#signupForm');
const logOutBtn = document.querySelector('.nav__el--logout');

const bookTourBtn = document.querySelector('#book-tour');

// DELEGATION
// Get the Map Locations and call the displayMap Function
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

// Getting the Signup details, creating a new user and logging them in directly
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    await signup(name, email, password, passwordConfirm);
  });
}

// Getting the Login Credentials form the user and logging the user in
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await login(email, password);
  });
}

// Update user data using the API
if (updateUserDataForm) {
  updateUserDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.getElementById('updateDataBtn').textContent = 'Updating...';

    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateInfo(form);

    document.getElementById('updateDataBtn').textContent = 'Save Settings';
  });
}

// Update the Password Using API
if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.getElementById('updatePasswordBtn').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updatePassword(passwordCurrent, password, passwordConfirm);

    document.getElementById('updatePasswordBtn').textContent = 'Save Password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

// Logout User
if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (bookTourBtn) {
  bookTourBtn.addEventListener('click', (e) => {
    bookTourBtn.textContent = 'Processing...';
    const { tourId } = e.target.dataset;

    bookTour(tourId);
  });
}
