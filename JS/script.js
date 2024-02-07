

const langButton = document.querySelector('#lang-switch');
const textToChange = document.querySelectorAll('[data-lang]');
// const enText = document.querySelectorAll('[data-lang="en"]');

const handleLangClick = () => {
  textToChange.forEach(element => {
    element.style.display = element.style.display === 'none' ? '' : 'none';
    element.style.visibility = element.style.visibility === 'hidden' ? 'visible' : 'hidden';
  });
}

langButton.addEventListener('click', handleLangClick);
