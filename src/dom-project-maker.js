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

    let taskList = document.createElement("div");
    taskList.className = "task-list";
    const newTaskList = refreshTaskList(taskList, project.getTaskList());
    const newTaskButton = makeNewTaskButton();


    projectCard.appendChild(newTaskButton);
    projectCard.appendChild(newTaskList);

    attachCardSavedListener(projectCard, project);
    attachDiscardChangesListener(projectCard, project);
    attachDeleteCardListener(projectCard, project);

    return projectCard;
}

function attachDiscardChangesListener(projectCard, project) {
    projectCard.addEventListener('discard-changes', (e) => {
        if (!e.detail.taskID) {
            e.target.remove();
        }
        else {
            // TBD
        }
    });
}

function attachCardSavedListener(projectCard, project) {
    projectCard.addEventListener('card-saved', (e) => {
        project.addTask(e.detail.task);
        const oldTaskList = projectCard.querySelector(".task-list");
        const newTaskList = refreshTaskList(oldTaskList, project.getTaskList());
        oldTaskList.replaceWith(newTaskList);
    });
}

function attachDeleteCardListener(projectCard, project) {
    projectCard.addEventListener('delete-card', (e) => {
        project.removeTask(e.detail.taskID);
        const oldTaskList = projectCard.querySelector(".task-list");
        const newTaskList = refreshTaskList(oldTaskList, project.getTaskList());
        oldTaskList.replaceWith(newTaskList);
    });
}

function refreshTaskList(oldTaskList, projectTasks) {
    const taskList = document.createElement("div");
    taskList.className = "task-list";

    let domTaskList = [];

    const editTasks = oldTaskList.querySelectorAll(".edit-task");
    if (editTasks) {
        domTaskList = [...editTasks];
    }

    for (const task of projectTasks) {
        const taskCard = domTaskMaker(task);
        domTaskList.push(taskCard);
    }

    for (const task of domTaskList) {
        taskList.appendChild(task);
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
        if (document.getElementById("new-task-card")) {
            alert("Please finish creating or editing the current task!");
            return;
        }
        const taskList = taskButtonDiv.parentNode.querySelector(".task-list");
        taskList.prepend(domNewTaskCardMaker());
    });

    return taskButtonDiv;
}



export default domProjectMaker;