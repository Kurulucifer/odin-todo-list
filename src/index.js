import "./stylesheet.css";
import domProjectsHandler from "./js/dom-projects-handler.js";
import projectsHandler from "./js/js-projects-handler.js";
import todoStorage from "./js/todo-storage.js";

function main() {
    const todo = document.getElementById("todo");

    const storageHandler = todoStorage();
    const projectsList = storageHandler.loadProjects();
    const projects = projectsHandler(projectsList);

    domProjectsHandler(projects);

    todo.addEventListener("update-storage", () => {
        const updatedProjectsList = projects;
        storageHandler.saveProjects(updatedProjectsList);
    });
}

main();
