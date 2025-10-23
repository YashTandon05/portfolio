import { fetchJSON, renderProjects, updateProjectsCount } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');
updateProjectsCount(projects);