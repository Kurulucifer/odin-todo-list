import "./stylesheet.css";
import domNewTaskCardMaker from "./dom-new-task-card-maker.js";
import domProjectMaker from "./dom-project-maker.js";
import projectMaker from "./project-maker.js";

const projectName = "New Project";
const projectDetails = "This is a new project.";
const projectColor = "green";
const projectObject = projectMaker(projectName, projectDetails, projectColor);

const project = domProjectMaker(projectObject);

const projects = document.getElementById("projects");
projects.appendChild(project);

project.addEventListener('card-saved', (e) => {
    console.log(e.detail.task);
})

project.addEventListener('discard-changes', (e) => {
    console.log("Throw away!");
})

