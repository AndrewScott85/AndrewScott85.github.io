

/*
Switch language between English and French
*/
// Select language switch
const langSwitch = document.querySelector('#lang-switch');

// Function to create anchor to be added to the text where necessary
const createAnchor = (href, text) => {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = text;
  return anchor;
}

// Update content based on selected language
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

// Fetch language data
const fetchLanguageData = async (lang) => {
  const response = await fetch(`Languages/${lang}.json`);
  return response.json();
}

// Change language
async function changeLanguage(lang) {
  const langData = await fetchLanguageData(lang);
  updateContent(langData);
}

// Function called when language switch clicked
const handleLangClick = () => {
  lang = lang === 'en' ? 'fr' : 'en';
  changeLanguage(lang);
  langSwitch.checked = lang !== 'en';
}
/*
 Show current page section in Navbar
*/
const sections = document.querySelectorAll('section');
const navList = document.querySelectorAll('nav .container ul li');

const updateActiveNavLink = () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    // Ensure detection works at bottom of the page
    if (scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
      current = 'contact';
    }
    // Handle other cases
    else if (scrollY >= (sectionTop - (sectionHeight / 8))) {
      current = section.getAttribute('id');
    }

  })

  navList.forEach(item => {
    item.classList.remove('active');
    if (item.classList.contains(current)) {
      item.classList.add('active')
    }
  })
}

// Listen for scroll events
window.addEventListener('scroll', updateActiveNavLink);

// Add event listener for translation button
langSwitch.addEventListener('click', handleLangClick);

// Default to English if french switch not clicked
let lang = langSwitch.checked === true ? 'fr' : 'en';
changeLanguage(lang);