import axios from 'axios';
import { showAlert } from './alerts';

// Function to update the currently logged in user's data
export const updateInfo = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data,
    });

    if (res.data.data.status === 'success') {
      res.status(200).render('account', {
        title: res.locals.user.name,
        user: res.data.data.user,
      });
    }

    showAlert('success', 'Your details were updated successfully!');
    window.setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// Function to update the currently logged in user's data
export const updatePassword = async (passwordCurrent, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });

    if (res.data.data.status === 'success') {
      res.status(200).render('account', {
        title: res.locals.user.name,
        user: res.data.data.user,
      });
    }

    showAlert('success', 'Your Password was updated successfully!');
    window.setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
