function toggleText() {
  const buttonElement = document.querySelector('.toggle-text-button');
  const textElement = document.getElementById('text');

  buttonElement.addEventListener('click', function() {
    if (textElement.hasAttribute('hidden')) {
      textElement.removeAttribute('hidden');
    } else {
      textElement.setAttribute('hidden', '');
    }
  });
}