import { format } from "date-fns";

function domTaskMaker(task) {
    const taskCard = document.createElement("div");
    taskCard.className = "task";
    taskCard.dataset.id = task.getField("id");

    const name = document.createElement("div");
    name.className = "name";
    
    const dateTime = document.createElement("div");
    dateTime.className = "date-time";

    const dateInput = document.createElement("input");
    dateInput.className = "date-input";
    dateInput.type = "date";
    const date = document.createElement("div");
    date.className = "date";
    const timeInput = document.createElement("input");
    timeInput.className = "time-input";
    timeInput.type = "time";
    const time = document.createElement("div");
    time.className = "time";

    dateTime.appendChild(dateInput);
    dateTime.appendChild(date);
    dateTime.appendChild(timeInput);
    dateTime.appendChild(time);

    const details = document.createElement("div");
    details.className = "details";

    const border = document.createElement("hr");

    const notes = document.createElement("div");
    notes.className = "notes";

    const editButtons = document.createElement("div");
    editButtons.className = "edit-buttons";
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    editButtons.appendChild(deleteButton);
    editButtons.appendChild(editButton);
    editButtons.appendChild(completeButton);

    // filling in 

    name.textContent = task.getField("name");
    details.textContent = task.getField("details");
    notes.textContent = task.getField("notes");

    date.textContent = format(task.getField("date"), "M/d");
    time.textContent = format(task.getField("date"), "H:mm");

    taskCard.appendChild(name);
    taskCard.appendChild(dateTime);
    taskCard.appendChild(details);
    taskCard.appendChild(border);
    taskCard.appendChild(notes);
    taskCard.appendChild(editButtons);

    // DO THIS LATER!
    // if (task.getField("type") === "checklist") {
    //     const checklist = document.createElement("div");
    //     for (item in task.getAllItems()) {
    //         const listItem = document.createElement("div");
    //         listItem.className = "checklist-item";
    //         listItem.textContent = item.label;
    //         checklist.appendChild(listItem);
    //     }
    //     taskCard.appendChild(checklist);
    // }

    attachDeleteListener(deleteButton, taskCard, task);

    return taskCard;
}

function attachDeleteListener(deleteButton, taskCard, task) {
    const deleteCard = new CustomEvent("delete-card", {
        bubbles: true,
        detail: {
            taskID: task.getField("id"),
        },
    });
    deleteButton.addEventListener('click', () => {
        taskCard.dispatchEvent(deleteCard);
    });
}

export default domTaskMaker;