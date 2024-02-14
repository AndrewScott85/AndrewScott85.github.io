

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
  updatePortfolio(langData.projects);
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
const projectModal = document.querySelector('.projectModal');
const close = document.querySelector('.close');

close.addEventListener('click', () => {
  // Remove the last child (assuming it's the modal image)
  projectModal.lastChild && projectModal.removeChild(projectModal.lastChild);
  projectModal.style.display = 'none';
});

const handleModal = (img) => {
  const modalCont = document.createElement('div');
  modalCont.className = 'modal_proj_cont';
  const modalImg = img.cloneNode(true);
  modalCont.appendChild(modalImg);
  projectModal.appendChild(modalCont);
  projectModal.style.display = 'flex';
};

/*
Populate Project Section
*/
const createProjectContainer = (project) => {
  const container = document.createElement('div');
  container.className = 'project_container';

  const figure = document.createElement('figure');
  figure.className = 'project_figure';

  const img = document.createElement('img');
  img.src = project.image;
  img.alt = `${project.title} Project Image`;
  figure.appendChild(img);

  const figcaption = document.createElement('figcaption');
  figcaption.textContent = project.title;
  figure.appendChild(figcaption);

  container.appendChild(figure);

  // Event listener to toggle the display of details
  img.addEventListener('click', () => handleModal(img));

  // // Create container to hide all details
  // const details = document.createElement('div');
  // details.className = 'project_details';
  // details.style.display = 'none';


  // const description = document.createElement('p');
  // description.textContent = project.description;
  // details.appendChild(description);

  // const projectLinks = document.createElement('div');
  // projectLinks.className = 'project_links';

  // const ul = document.createElement('ul');
  // project.github.forEach(link => {
  //   const li = document.createElement('li');
  //   li.className = 'github_link';
  //   const a = document.createElement('a');
  //   a.href = link.url;
  //   a.target = '_blank';
  //   a.textContent = ' ' + link.text;
  //   const icon = document.createElement('i');
  //   icon.className = 'fa-brands fa-github-square';
  //   a.prepend(icon); // Prepend the icon to the anchor text
  //   li.appendChild(a);
  //   ul.appendChild(li);
  // });

  // const liveLink = document.createElement('li');
  // liveLink.className = 'site_link';
  // const liveA = document.createElement('a');
  // liveA.href = project.liveUrl;
  // liveA.target = '_blank';
  // liveA.textContent = ' Live';
  // const liveIcon = document.createElement('i');
  // liveIcon.className = 'fa-solid fa-globe';
  // liveA.prepend(liveIcon); // Prepend the icon to the anchor text
  // liveLink.appendChild(liveA);
  // ul.appendChild(liveLink);

  // projectLinks.appendChild(ul);
  // details.appendChild(projectLinks);




  //   // Append the details to the container
  //   container.appendChild(details);

  return container;
};

// Function to update the portfolio section with project details
const updatePortfolio = (projects) => {
  const portfolioList = document.querySelector('.portfolio_list');
  portfolioList.textContent = ''; // Clear existing content safely

  projects.forEach(project => {
    const projectContainer = createProjectContainer(project);
    portfolioList.appendChild(projectContainer);
  });
};




// Listen for scroll events
window.addEventListener('scroll', updateActiveNavLink);

// Add event listener for translation button
langSwitch.addEventListener('click', handleLangClick);

// Default to English if french switch not clicked
let lang = langSwitch.checked === true ? 'fr' : 'en';
changeLanguage(lang);