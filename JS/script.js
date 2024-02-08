const langButton = document.querySelector('#lang-switch');


// Function to update content based on selected language
const updateContent = (langData) => {
  document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      console.log(key);
      element.innerText = langData[key];
  });
}


// Function to fetch language data
const fetchLanguageData = async(lang) => {
  const response = await fetch(`Languages/${lang}.json`);
  return response.json();
}

// Function to change language
async function changeLanguage(lang) {
  
  const langData = await fetchLanguageData(lang);
    updateContent(langData);
}

const handleLangClick = () => {
console.log('in handleLangClick');
console.log('lang = ' + lang);
  lang = lang === 'en' ? 'fr' : 'en';
console.log('lang = ' + lang);
  changeLanguage(lang);

  
}

langButton.addEventListener('click', handleLangClick);

// Default to English
let lang = 'en';
changeLanguage(lang);