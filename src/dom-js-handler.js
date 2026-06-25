import projectHandler from "./project-handler.js";
import domProjectMaker from "./dom-project-maker.js";

const domJSHandler = (fromStorage = []) => {
    const projectName = "Default Project";
    const projectDetails = "This is athedefault project.";
    const projectColor = "blue";
    const newProjectObject = { name: projectName, details: projectDetails, color: projectColor };

    const projectObject = projectMaker(newProjectObject);
    const project = domProjectMaker(projectObject);

    const projects = document.getElementById("projects");
    projects.appendChild(project);
};

export default domJSHandler;