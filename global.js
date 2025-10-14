console.log('IT’S ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

/*
const navLinks = $$("nav a");

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname,
  );
currentLink?.classList.add('current');
*/

/* <nav>
<ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="projects/index.html">Projects</a></li>
    <li><a href="contact/index.html">Contact</a></li>
    <li><a href="resume/index.html">Resume</a></li>
    <li><a href="https://github.com/yashtandon05" target="_blank">GitHub</a></li>
</ul>
</nav> */

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/yashtandon05', title: 'GitHub' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                  // Local server
    : "/website/";         // GitHub Pages repo name
    url = !url.startsWith('http') ? BASE_PATH + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    
    if (a.host != location.host) {
        a.target = '_blank';
    }
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
                <option value="light dark">Light Dark</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
          </select>
      </label>`,
);

var select = document.querySelector('.color-scheme select');
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
});

if (localStorage.colorScheme) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}
else {
    document.documentElement.style.setProperty('color-scheme', 'light dark');
}