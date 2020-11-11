// To hide the alert window
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// To display the alert on top of the screen regarding the status of Authentication
export const showAlert = (type, message) => {
  hideAlert();
  const markUp = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
  window.setTimeout(() => {
    hideAlert();
  }, 5000);
};
