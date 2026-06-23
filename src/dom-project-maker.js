import domNewTaskCardMaker from "./dom-new-task-card-maker.js";
import domTaskMaker from "./dom-task-maker.js";

function domProjectMaker(project) {
    const projectCard = document.createElement("div");
    projectCard.className = "project";
    projectCard.dataset.id = project.getField("id");

    const defaultFields = ["name", "details"];

    for (const field of defaultFields) {
        const element = document.createElement("div");
        element.className = `project-${field}`;
        element.textContent = project.getField(field);
        projectCard.appendChild(element);
    }

    const taskList = refreshTaskList(project.getTaskList());
    const newTaskButton = makeNewTaskButton();

    projectCard.appendChild(newTaskButton);
    projectCard.appendChild(taskList);

    attachProjectListeners(projectCard, project);

    return projectCard;
}

function attachProjectListeners(projectCard, project) {
    projectCard.addEventListener('card-saved', (e) => {
        project.addTask(e.detail.task);
        const oldTaskList = projectCard.querySelector(".task-list");
        const newTaskList = refreshTaskList(project.getTaskList());
        oldTaskList.replaceWith(newTaskList);
    });
    projectCard.addEventListener('discard-changes', (e) => {
        console.log("Discarded a change!")
    });
}

function refreshTaskList(projectTasks) {
    const taskList = document.createElement("div");
    taskList.className = "task-list";

    for (const task of projectTasks) {
        const taskCard = domTaskMaker(task);
        taskList.appendChild(taskCard);
    }

    return taskList;
}

function makeNewTaskButton() {
    const taskButton = document.createElement("button");
    taskButton.textContent = "Add a task";
    const taskButtonDiv = document.createElement("div");
    taskButtonDiv.className = "new-task-button";
    taskButtonDiv.appendChild(taskButton);

    taskButton.addEventListener('click', () => {
        const taskList = taskButtonDiv.parentNode.querySelector(".task-list");
        taskList.prepend(domNewTaskCardMaker());
    });

    return taskButtonDiv;
}



export default domProjectMaker;