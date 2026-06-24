import { format } from "date-fns";

function domTaskMaker(task) {
    const taskCardTemplate = document.getElementById("task-card-template").content.querySelector(".task");
    const taskCard = taskCardTemplate.cloneNode(true);

    const taskCardClasses = taskCard.classList;
    taskCardClasses.add(`priority-${task.getField("priority")}`);
    taskCard.dataset.id = task.getField("id");

    if (task.getField("done")) {
        taskCardClasses.add("done");
    }

    // filling in

    const name = taskCard.querySelector(".name");
    const details = taskCard.querySelector(".details");
    const notes = taskCard.querySelector(".notes");
    const date = taskCard.querySelector(".date");
    const time = taskCard.querySelector(".time");
    const deleteButton = taskCard.querySelector(".delete-button");
    const editButton = taskCard.querySelector(".edit-button");
    const completeButton = taskCard.querySelector(".complete-button");
    const expandCollapseButton = taskCard.querySelector(".expand-collapse");

    name.textContent = task.getField("name");
    details.textContent = task.getField("details");
    notes.textContent = task.getField("notes");
    date.textContent = format(task.getField("date"), "M/d");
    time.textContent = format(task.getField("date"), "H:mm");

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
        const collapsible = taskCard.querySelector(".collapsible");
        collapsible.classList.toggle("hidden");
    });
}

export default domTaskMaker;