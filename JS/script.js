
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

  // Get text for 'tech_used' in project container
  return langData.tech_used;
}

// Fetch language data
const fetchLanguageData = async (lang) => {
  const response = await fetch(`Languages/${lang}.json`);
  return response.json();
}


// Change language
let tech_used = '';
const changeLanguage = async (lang) => {
  const langData = await fetchLanguageData(lang);
  tech_used = langData.tech_used;
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

const createProjectFigure = (project) => {
  const figure = document.createElement('figure');
  figure.className = 'project_figure';

  const img = document.createElement('img');
  img.src = project.image;
  img.alt = `${project.title} Project Image`;
  figure.appendChild(img);

  const figcaption = document.createElement('figcaption');
  const titleSpan = document.createElement('span');
  titleSpan.className = 'project_title'; // Add class for styling title
  titleSpan.textContent = project.title;
  const stackSpan = document.createElement('span');
  stackSpan.className = 'project_stack'; // Add class for styling stack (full-stack, front-end etc)
  stackSpan.textContent = `(${project.stack})`;
  figcaption.appendChild(titleSpan);
  figcaption.appendChild(stackSpan);
  figure.appendChild(figcaption);

  return figure;
}

const createProjectSummary = (projectSummary) => {
  const summary = document.createElement('p');
  summary.className = 'summary';
  summary.textContent = projectSummary;

  return summary;
}

/*
Populate Project Section
*/
const createProjectContainer = (project) => {
  const container = document.createElement('div');
  container.className = 'project_container';

  // create project figure
  const figure = createProjectFigure(project);
  container.appendChild(figure);

  // create project summary
  const summary = createProjectSummary(project.summary);
  container.appendChild(summary);

  const description = document.createElement('p');
  description.className = 'projectDescription';
  description.textContent = project.description;
  container.appendChild(description);

  const techTitle = document.createElement('p');
  techTitle.className = 'techTitle';
  techTitle.textContent = tech_used;
  container.append(techTitle);

  const techList = document.createElement('ul');
  project.technologies.forEach(item => {
    const techItem = document.createElement('li');
    techItem.textContent = item;
    techList.appendChild(techItem);
  });
  container.appendChild(techList);


  const projectLinks = document.createElement('div');
  projectLinks.className = 'project_links';

  const ul = document.createElement('ul');

  let isMultiGit = false;
  if (project.github.length >1) {
    isMultiGit = true;
  }
  project.github.forEach(link => {
    const li = document.createElement('li');
    li.className = 'github_link';
    if (isMultiGit) {
      li.id = link === project.github[0] ? 'github_link_fe' : 'github_link_be';

    }
        const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.textContent = ' ' + link.text;
    const icon = document.createElement('i');
    icon.className = 'fa-brands fa-github-square';
    a.prepend(icon); // Prepend the icon to the anchor text
    li.appendChild(a);
    ul.appendChild(li);
  });

  const liveLink = document.createElement('li');
  liveLink.className = 'site_link';
  const liveA = document.createElement('a');
  liveA.href = project.liveUrl;
  liveA.target = '_blank';
  liveA.textContent = ' Live';
  const liveIcon = document.createElement('i');
  liveIcon.className = 'fa-solid fa-globe';
  liveA.prepend(liveIcon);
  liveLink.appendChild(liveA);
  ul.appendChild(liveLink);

  projectLinks.appendChild(ul);
  container.appendChild(projectLinks);

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