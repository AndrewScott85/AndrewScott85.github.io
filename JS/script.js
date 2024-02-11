const langSwitch = document.querySelector('#lang-switch');



// Function to update content based on selected language
const updateContent = (langData) => {
  // Select all relevant tags and iterate through the json
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const content = langData[key];

    // Clear existing content safely
    element.textContent = '';

    // Create and append elements for text and anchors
    const parts = content.split(/(<a[^>]*>.*?<\/a>)/);
    parts.forEach(part => {
      if (!part.startsWith('<a')) {
        element.appendChild(document.createTextNode(part));
      } else {
        const anchorMatch = part.match(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/);
        if (anchorMatch) {
          const href = anchorMatch[1];
          const anchorText = anchorMatch[2];
          const anchor = createAnchor(href, anchorText);
          element.appendChild(anchor);
        }
      }
    });
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
  console.log(langSwitch.checked);
  lang = lang === 'en' ? 'fr' : 'en';
  changeLanguage(lang);
  langSwitch.checked = lang !== 'en';
  console.log(langSwitch.checked);
}


function createAnchor(href, text) {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = text;
  return anchor;
}


// Add event listener for translation button
langSwitch.addEventListener('click', handleLangClick);

// Default to English
let lang = 'en';
changeLanguage(lang);