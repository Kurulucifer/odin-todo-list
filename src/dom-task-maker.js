import { format } from "date-fns";

function domTaskMaker(task) {
    const taskCard = document.createElement("div");
    taskCard.className = "task";
    taskCard.dataset.id = task.getField("id");

    if (task.getField("done")) {
        taskCard.className = "task done";
    }

    const expandCollapseButton = document.createElement("button");
    expandCollapseButton.className = "expand-collapse";
    expandCollapseButton.textContent = "-";

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
    const borderClasses = border.classList;
    borderClasses.add("collapsible");
    borderClasses.add("hidden");

    const notes = document.createElement("div");
    const notesClasses = notes.classList;
    notesClasses.add("notes");
    notesClasses.add("collapsible");
    notesClasses.add("hidden");

    const editButtons = document.createElement("div");
    const editButtonsClasses = editButtons.classList;
    editButtonsClasses.add("edit-buttons");
    editButtonsClasses.add("collapsible");
    editButtonsClasses.add("hidden");

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

    taskCard.appendChild(expandCollapseButton);
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
    attachEditListener(editButton, taskCard, task);
    attachCompleteListener(completeButton, taskCard, task);
    attachExpandCollapseListener(expandCollapseButton, taskCard);

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

function attachEditListener(editButton, taskCard, task) {
    const editCard = new CustomEvent("edit-card", {
        bubbles: true,
        detail: {
            taskFields: task.getAllFields(),
        }
    });
    editButton.addEventListener('click', () => {
        taskCard.dispatchEvent(editCard);
    });
}

function attachCompleteListener(completeButton, taskCard, task) {
    const completeCard = new CustomEvent("complete-card", {
        bubbles: true,
        detail: {
            taskID: task.getField("id"),
        }
    });
    completeButton.addEventListener('click', () => {
        taskCard.dispatchEvent(completeCard);
    });
}

function attachExpandCollapseListener(expandCollapseButton, taskCard) {
    expandCollapseButton.addEventListener('click', (e) => {
        if (e.target.matches("button") && !e.target.matches(".expand-collapse")) {
            return;
        }
        const collapsibles = taskCard.querySelectorAll(".collapsible");
        for (const element of collapsibles) {
            element.classList.toggle("hidden");
        }
    });
}

export default domTaskMaker;