import domNewTaskMaker from "./dom-new-task-maker.js";
import domTaskMaker from "./dom-task-maker.js";

function domProjectMaker(project) {
    const projectCardTemplate = document.getElementById("project-card-template").content.querySelector(".project");
    const projectCard = projectCardTemplate.cloneNode(true);

    const name = projectCard.querySelector(".name");
    const details = projectCard.querySelector(".details");
    const newTaskButtons = projectCard.querySelector(".new-task-buttons");
    const addTaskButton = newTaskButtons.querySelector(".add-task-button");

    name.textContent = project.getField("name");
    details.textContent = project.getField("details");

    attachNewTaskListener(projectCard, addTaskButton);
    attachCardSavedListener(projectCard, project);
    attachDiscardChangesListener(projectCard, project);
    attachDeleteCardListener(projectCard, project);
    attachEditCardListener(projectCard, project);
    attachCompleteCardListener(projectCard, project);
    
    refreshTaskList(projectCard, project);

    return projectCard;
}

function attachNewTaskListener(projectCard, taskButton) {
    taskButton.addEventListener('click', () => {
        const taskList = projectCard.querySelector(".task-list");
        taskList.prepend(domNewTaskMaker());
    });
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

function attachDeleteCardListener(projectCard, project) {
    projectCard.addEventListener('delete-card', (e) => {
        project.removeTask(e.detail.taskID);
        refreshTaskList(projectCard, project);
    });
}

function attachEditCardListener(projectCard, project) {
    projectCard.addEventListener('edit-card', (e) => {
        const task = e.detail.task;
        const editCard = domNewTaskMaker( { ...task.getAllFields() } );
        e.target.replaceWith(editCard);
    });
}

function attachCompleteCardListener(projectCard, project) {
    projectCard.addEventListener('complete-card', (e) => {
        project.getTask(e.detail.taskID).toggleDone();
        refreshTaskList(projectCard, project);
    })
}

function saveTask(taskFields, projectCard, project) {
    const { checklist, ...baseTask } = taskFields;

    if (taskFields.id) {
        const taskToEdit = project.getTask(baseTask.id);
        taskToEdit.updateField(baseTask);
        // additional checklist stuff
        if (taskFields.type === "checklist") {
            // can't really save item completion status
            // (read: I don't want to)
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

export default domProjectMaker;