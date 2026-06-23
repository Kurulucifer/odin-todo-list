function domProjectMaker(project) {
    const projectCard = document.createElement("div");
    projectCard.className = "project";
    projectCard.dataset.id = project.getField("id");

    const defaultFields = ["name", "details"];

    for (field of defaultFields) {
        const element = document.createElement("div");
        element.className = `project-${field}`;
        element.textContent = project.getField(field);
        projectCard.appendChild(element);
    }

    projectCard.appendChild(newTaskButton());

    const taskList = document.createElement("div");
    taskList.className = "task-list";
    taskCard.appendChild(taskList);

    return projectCard;
}

function newTaskButton() {
    const taskButton = document.createElement("button");
    taskButton.textContent = "Add a task";
    const taskButtonDiv = document.createElement("div");
    taskButtonDiv.className = "new-task-button";
    taskButtonDiv.appendChild(taskButton);

    return taskButtonDiv;
}

export default domProjectMaker;