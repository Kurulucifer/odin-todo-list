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
    
    refreshTaskList(projectCard, project);

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
            refreshTaskList(projectCard, project);
        }
    });
}

function attachCardSavedListener(projectCard, project) {
    projectCard.addEventListener('card-saved', (e) => saveTask(e.detail.task, projectCard, project));
}

function saveTask(taskFields, projectCard, project) {
    const { checklist, ...baseTask } = taskFields;

    if (taskFields.id) {
        const taskToEdit = project.getTask(baseTask.id);
        taskToEdit.updateField(baseTask);
        if (checklist.length > 0) {
            taskToEdit.resetItems();
            for (const item of checklist) {
                taskToEdit.addItem(item);
            }
        }
    }
    else {
        project.addTask(baseTask, 
            { checklist });
    }
    
    refreshTaskList(projectCard, project);
}

function attachDeleteCardListener(projectCard, project) {
    projectCard.addEventListener('delete-card', (e) => {
        project.removeTask(e.detail.taskID);
        refreshTaskList(projectCard, project);
    });
}

function attachEditCardListener(projectCard, project) {
    projectCard.addEventListener('edit-card', (e) => {
        const task = e.detail.task;
        const editCard = domNewTaskCardMaker( { ...task.getAllFields() } );
        e.target.replaceWith(editCard);
    });
}

function attachCompleteCardListener(projectCard, project) {
    projectCard.addEventListener('complete-card', (e) => {
        project.getTask(e.detail.taskID).toggleDone();
        refreshTaskList(projectCard, project);
    })
}

function refreshTaskList(projectCard, project) {
    const taskList = document.createElement("div");
    taskList.className = "task-list";

    project.sortTasks();
    const oldTaskList = projectCard.querySelector(".task-list");
    const projectTasks = project.getTaskList();


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