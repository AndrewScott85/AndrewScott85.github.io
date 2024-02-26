
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

  // Get text for 'tech-used' in project container
  return langData.tech_used;
}

// Fetch language data
const fetchLanguageData = async (lang) => {
  const response = await fetch(`Languages/${lang}.json`);
  return response.json();
}


// Change language
let techUsed = '';
const changeLanguage = async (lang) => {
  const langData = await fetchLanguageData(lang);
  techUsed = langData.tech_used;
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
Helper Functions for createProjectContainer
*/
const createProjectFigure = ({ image, title, stack }) => {
  const figure = document.createElement('figure');
  figure.className = 'project-figure';

  const img = document.createElement('img');
  img.src = image;
  img.alt = `${title} Project Image`;
  figure.appendChild(img);

  const figcaption = document.createElement('figcaption');
  const titleSpan = document.createElement('span');
  titleSpan.className = 'project-title'; // Add class for styling title
  titleSpan.textContent = title;
  const stackSpan = document.createElement('span');
  stackSpan.className = 'project-stack'; // Add class for styling stack (full-stack, front-end etc)
  stackSpan.textContent = `(${stack})`;
  figcaption.appendChild(titleSpan);
  figcaption.appendChild(stackSpan);
  figure.appendChild(figcaption);
  return figure;
}

const createProjectSummary = (summary) => {
  const smmry = document.createElement('p');
  smmry.className = 'summary';
  smmry.textContent = summary;
  return smmry;
}

const createProjectDescription = (description) => {
  const dscrptn = document.createElement('p');
  dscrptn.className = 'project-description';
  dscrptn.textContent = description;
  return dscrptn;
}

const createTechStack = (technologies) => {
  const techStack = document.createElement('div');
  techStack.className = 'tech-stack';
  const techTitle = document.createElement('p');
  techTitle.className = 'tech-title';
  techTitle.textContent = techUsed;
  techStack.appendChild(techTitle);

  const techList = document.createElement('ul');
  technologies.forEach(item => {
    const techItem = document.createElement('li');
    techItem.textContent = item;
    techList.appendChild(techItem);
  });
  techStack.appendChild(techList);
  return techStack;
}

const createProjectLinks = ({ github, liveUrl }) => {
  const projectLinks = document.createElement('div');
  projectLinks.className = 'project-links';

  const ul = document.createElement('ul');

  //create and format github links, including where separate front & back-end
  github.forEach(link => {
    const li = document.createElement('li');
    li.className = 'github-link';
    if (github.length > 1) {
      li.id = link === github[0] ? 'github-link-fe' : 'github-link-be';
    }
    // Create anchor links for github 
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.textContent = ' ' + link.text;
    // Attach icon to link
    const icon = document.createElement('i');
    icon.className = 'fa-brands fa-github-square';
    a.prepend(icon); // Prepend the icon to the anchor text
    li.appendChild(a);
    ul.appendChild(li);
  });

  // Create link to project site
  const liveLink = document.createElement('li');
  liveLink.className = 'site-link';
  // Create anchor link for project sie 
  const liveA = document.createElement('a');
  liveA.href = liveUrl;
  liveA.target = '_blank';
  liveA.textContent = ' Live';
  // Attach icon to link
  const liveIcon = document.createElement('i');
  liveIcon.className = 'fa-solid fa-globe';
  liveA.prepend(liveIcon);
  liveLink.appendChild(liveA);
  ul.appendChild(liveLink);

  projectLinks.appendChild(ul);

  return projectLinks;
}

/*
Populate Project Section
*/
const createProjectContainer = ({
  title,
  stack,
  summary,
  description,
  technologies,
  image,
  github,
  liveUrl,
}) => {
  const container = document.createElement('div');
  container.className = 'project-container';

  // create project figure
  const figure = createProjectFigure({ image, title, stack });
  container.appendChild(figure);

  // create project summary
  const smmry = createProjectSummary(summary);
  container.appendChild(smmry);

  // create project description
  const dscrptn = createProjectDescription(description);
  container.appendChild(dscrptn);

  // create tech stack title & list
  const techStack = createTechStack(technologies);
  container.append(techStack);

  // create project links section
  const projectLinks = createProjectLinks({ github, liveUrl });
  container.appendChild(projectLinks);

  return container;
};


// Update the portfolio section with project details
const updatePortfolio = (projects) => {
  const portfolioList = document.querySelector('.portfolio-list');
  portfolioList.textContent = ''; // Clear existing content safely

  projects.forEach(project => {
    const projectContainer = createProjectContainer(project);
    portfolioList.appendChild(projectContainer);
  });
};

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