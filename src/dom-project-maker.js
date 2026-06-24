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

    const newTaskButton = makeNewTaskButton();
    projectCard.appendChild(newTaskButton);

    let taskList = document.createElement("div");
    taskList.className = "task-list";
    projectCard.appendChild(taskList);
    
    refreshTaskList(projectCard, project.getTaskList());

    attachCardSavedListener(projectCard, project);
    attachDiscardChangesListener(projectCard, project);
    attachDeleteCardListener(projectCard, project);
    attachEditCardListener(projectCard, project);
    attachCompleteCardListener(projectCard, project);

    return projectCard;
}

function attachDiscardChangesListener(projectCard, project) {
    projectCard.addEventListener('discard-changes', (e) => {
        e.target.remove();
        if (e.detail.taskID) {
            refreshTaskList(projectCard, project.getTaskList());
        }
    });
}

function attachCardSavedListener(projectCard, project) {
    projectCard.addEventListener('card-saved', (e) => {
        const task = e.detail.task;
        if (task.id) {
            const taskToEdit = project.getTask(task.id);
            taskToEdit.updateField(e.detail.task);
        }
        else {
            project.addTask(task);
        }
        refreshTaskList(projectCard, project.getTaskList());
    });
}

function attachDeleteCardListener(projectCard, project) {
    projectCard.addEventListener('delete-card', (e) => {
        project.removeTask(e.detail.taskID);
        refreshTaskList(projectCard, project.getTaskList());
    });
}

function attachEditCardListener(projectCard, project) {
    projectCard.addEventListener('edit-card', (e) => {
        const editCard = domNewTaskCardMaker(e.detail.taskFields);
        e.target.replaceWith(editCard);
    });
}

function attachCompleteCardListener(projectCard, project) {
    projectCard.addEventListener('complete-card', (e) => {
        project.getTask(e.detail.taskID).toggleDone();
        refreshTaskList(projectCard, project.getTaskList());
    })
}

function refreshTaskList(projectCard, projectTasks) {
    const taskList = document.createElement("div");
    taskList.className = "task-list";

    const oldTaskList = projectCard.querySelector(".task-list");

    let domTaskList = [];

    // For if there's cards still being edited
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

    oldTaskList.replaceWith(taskList);
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