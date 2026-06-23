function domTaskMaker(task) {
    const taskCard = document.createElement("div");
    taskCard.className = "task";
    taskCard.dataset.id = task.getField("id");

    const defaultFields = ["name", "date", "details", "notes"];

    for (field of defaultFields) {
        const element = document.createElement("div");
        element.className = field;
        element.textContent = task.getField(field);
        taskCard.appendChild(element);
    }

    if (task.getField("type") === "checklist") {
        const checklist = document.createElement("div");
        for (item in task.getAllItems()) {
            const listItem = document.createElement("div");
            listItem.className = "checklist-item";
            listItem.textContent = item.label; // will do "done" checkbox later
            checklist.appendChild(listItem);
        }
        taskCard.appendChild(checklist);
    }

    return taskCard;
}

export default domTaskMaker;