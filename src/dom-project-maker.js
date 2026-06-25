import domNewTaskMaker from "./dom-new-task-maker.js";
import domTaskMaker from "./dom-task-maker.js";

function domProjectMaker(project) {
    const projectCardTemplate = document.getElementById("project-card-template").content.querySelector(".project");
    const projectCard = projectCardTemplate.cloneNode(true);

    const name = projectCard.querySelector(".name");
    const details = projectCard.querySelector(".details");
    const editProjectButtons = projectCard.querySelector(".edit-project-buttons");
    const addTaskButton = editProjectButtons.querySelector(".add-task-button");
    const editProjectButton = editProjectButtons.querySelector(".edit-project-button");
    const saveProjectButton = editProjectButtons.querySelector(".save-project-button");
    const deleteProjectButton = editProjectButtons.querySelector(".delete-project-button");

    name.textContent = project.getField("name");
    details.textContent = project.getField("details");

    // this is getting ridiculous
    attachEditProjectListener(editProjectButton, projectCard, project);
    attachSaveProjectListener(saveProjectButton, projectCard, project);
    attachDeleteProjectListener(deleteProjectButton, projectCard, project);
    attachNewTaskListener(projectCard, addTaskButton);
    attachCardSavedListener(projectCard, project);
    attachDiscardChangesListener(projectCard, project);
    attachEditCardListener(projectCard, project);
    attachDeleteCardListener(projectCard, project);
    attachCompleteCardListener(projectCard, project);
    
    refreshTaskList(projectCard, project);

    return projectCard;
}

function attachNewTaskListener(projectCard, addTaskButton) {
    addTaskButton.addEventListener('click', () => {
        const taskList = projectCard.querySelector(".task-list");
        taskList.prepend(domNewTaskMaker());
    });
}

function attachEditProjectListener(editProjectButton, projectCard, project) {
    const editProject = new CustomEvent('edit-project', {
        bubbles: true,
        detail: {
            projectID: project.getField("id"),
        }
    });
    editProjectButton.addEventListener('click', () => {
        projectCard.dispatchEvent(editProject);
    })
}

function attachSaveProjectListener(saveProjectButton, projectCard, project) {
    const saveProject = new CustomEvent('save-project', {
        bubbles: true,
        detail: {
            projectID: project.getField("id"),
        }
    });
    saveProjectButton.addEventListener('click', () => {
        projectCard.dispatchEvent(saveProject);
    })
}

function attachDeleteProjectListener(deleteProjectButton, projectCard, project) {
    const deleteProject = new CustomEvent('delete-project', {
        bubbles: true,
        detail: {
            projectID: project.getField("id"),
        },
    });
    deleteProjectButton.addEventListener('click', () => {
        projectCard.dispatchEvent(deleteProject);
    })
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
    projectCard.addEventListener('card-saved', (e) => {
        saveTask(e.detail.task, projectCard, project);
        refreshTaskList(projectCard, project);
    });
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

    // if I ever add listeners to taskList (unlikely since project handles)
    // this deletes them!
    oldTaskList.replaceWith(taskList);
}

export default domProjectMaker;