import domNewTaskCardMaker from "./dom-new-task-card-maker.js";

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

    const taskList = document.createElement("div");
    taskList.className = "task-list";
    projectCard.appendChild(newTaskButton(taskList));
    projectCard.appendChild(taskList);

    return projectCard;
}

function newTaskButton(taskList) {
    const taskButton = document.createElement("button");
    taskButton.textContent = "Add a task";
    const taskButtonDiv = document.createElement("div");
    taskButtonDiv.className = "new-task-button";
    taskButtonDiv.appendChild(taskButton);

    taskButton.addEventListener('click', () => {
        taskList.prepend(domNewTaskCardMaker());
    });

    return taskButtonDiv;
}

export default domProjectMaker;