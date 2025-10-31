import { fetchJSON, renderProjects, updateProjectsCount } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');
updateProjectsCount(projects);

// Define arc generator and colors outside the function so they can be reused
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Track selected slice index (-1 means none selected)
let selectedIndex = -1;

// Pie chart function for data viz
function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );

    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(newData);
    let arcs = arcData.map((d) => arcGenerator(d));
    

    let svg = d3.select('svg');
    svg.selectAll('path').remove();
    let legend = d3.select('.legend');
    legend.selectAll('li').remove();
    
    arcs.forEach((arc, i) => {
        svg
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .attr('class', selectedIndex === i ? 'selected' : '')
            .style('cursor', 'pointer')
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;
                
                let filteredProjects;
                if (selectedIndex === -1) {
                    filteredProjects = projectsGiven;
                } else {
                    let selectedYear = newData[selectedIndex].label;
                    filteredProjects = projectsGiven.filter((project) => project.year === selectedYear);
                }
                renderProjects(filteredProjects, projectsContainer, 'h2');
                
                svg
                    .selectAll('path')
                    .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');
                
                legend
                    .selectAll('li')
                    .attr('class', (_, idx) => {
                        // TODO: filter idx to find correct legend and apply CSS from above
                        let baseClass = 'legend-item';
                        return idx === selectedIndex ? `${baseClass} selected` : baseClass;
                    });
            });
    });
    
    newData.forEach((d, idx) => {
      legend
        .append('li')
        .attr('class', idx === selectedIndex ? 'legend-item selected' : 'legend-item')
        .attr('style', `--color:${colors(idx)}`)
        .style('cursor', 'pointer')
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
}
  
renderPieChart(projects);

// Search query
let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
    let filteredProjects = setQuery(event.target.value);
    selectedIndex = -1;
    
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

function setQuery(queryValue) {
    query = queryValue;
    
    let filteredProjects = projects.filter((project) => {
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query.toLowerCase());
    });
    return filteredProjects;
}