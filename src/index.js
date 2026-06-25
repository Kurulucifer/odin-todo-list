import "./stylesheet.css";
import domProjectMaker from "./dom-project-maker.js";
import projectMaker from "./project-maker.js";

const projectName = "New Project";
const projectDetails = "This is a new project.";
const projectColor = "green";
const newProjectObject = { name: projectName, details: projectDetails, color: projectColor };

const projectObject = projectMaker(newProjectObject);
const project = domProjectMaker(projectObject);

const projects = document.getElementById("projects");
projects.appendChild(project);

