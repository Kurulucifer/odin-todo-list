import { format, parse, set } from "date-fns";

function domNewTaskCardMaker(taskFields = {}) {

    // this will add "id", "done", and "type"
    // if they are available from an existing task
    // while editing
    // otherwise they will be filled by taskMaker
    let task = {
        name: "New Task",
        date: new Date(),
        details: "Details",
        notes: "Notes", 
        priority: "low",
        ...taskFields,
    };

    const editTaskCardTemplate = document.getElementById("edit-task-card-template").content.querySelector(".edit-task");
    const editTaskCard = editTaskCardTemplate.cloneNode(true);

    const date = editTaskCard.querySelector(".date");
    const dateInput = editTaskCard.querySelector(".date-input");
    addDateListeners(date, dateInput);

    const time = editTaskCard.querySelector(".time");
    const timeInput = editTaskCard.querySelector(".time-input");
    addTimeListeners(time, timeInput);
    
    // pre-filling

    const name = editTaskCard.querySelector(".name");
    const details = editTaskCard.querySelector(".details");
    const notes = editTaskCard.querySelector(".notes");
    const prioritySelect = editTaskCard.querySelector("select[name='priority']");
    const confirmButton = editTaskCard.querySelector(".confirm-button");
    const cancelButton = editTaskCard.querySelector(".cancel-button");

    name.textContent = task.name;
    details.textContent = task.details;
    notes.textContent = task.notes;
    prioritySelect.value = task.priority;

    date.textContent = format(task.date, "M/d");
    dateInput.value = format(task.date, "yyyy-MM-dd");
    time.textContent = format(task.date, "H:mm");
    timeInput.value = format(task.date, "HH:mm");

    addConfirmButtonListener(confirmButton, editTaskCard, task);
    addCancelButtonListener(cancelButton, editTaskCard, task);

    return editTaskCard;
}

function addDateListeners(dateDisplay, dateInput) {
    dateDisplay.addEventListener('click', () => dateInput.showPicker());
    dateInput.addEventListener('change', () => {
        const dateObject = parse(dateInput.value, "yyyy-MM-dd", new Date());
        dateDisplay.textContent = format(dateObject, "M/d");
    });
}

function addTimeListeners(timeDisplay, timeInput) {
    timeDisplay.addEventListener('click', () => timeInput.showPicker());
    timeInput.addEventListener('change', () => {
        const timeObject = parse(timeInput.value, "HH:mm", new Date());
        timeDisplay.textContent = format(timeObject, "H:mm");
    });
}

function addConfirmButtonListener(confirmButton, currentCard, task) {
    confirmButton.addEventListener('click', () => {
        const updatedTask = updateTaskFields(currentCard, task);
        const cardSaved = new CustomEvent("card-saved", {
            bubbles: true,
            detail: {
                task: updatedTask,
            },
        });
        currentCard.dispatchEvent(cardSaved);
        currentCard.remove();
    })
}

function addCancelButtonListener(cancelButton, currentCard, task) {
    const discardChanges = new CustomEvent("discard-changes", {
        bubbles: true,
        detail: {
            taskID: task.id,
        },
    });
    cancelButton.addEventListener('click', () => {
        currentCard.dispatchEvent(discardChanges);
    })
}

function updateTaskFields(currentCard, task) {
    // Putting in defaults again just in case...
    const nameField = currentCard.querySelector(".name").textContent.trim() || "New Task";
    const detailsField = currentCard.querySelector(".details").textContent.trim() || "Details";
    const notesField = currentCard.querySelector(".notes").textContent.trim() || "Notes";
    const priorityField = currentCard.querySelector("select[name='priority']").value;

    const dateInputValue = currentCard.querySelector(".date-input").value;
    const date = parse(dateInputValue, "yyyy-MM-dd", new Date());

    const timeInputValue = currentCard.querySelector(".time-input").value;
    const time = parse(timeInputValue, "HH:mm", new Date());

    const dateTimeField = set(date, {
        hours: time.getHours(),
        minutes: time.getMinutes(),
    });

    const newFields = {
        name: nameField,
        details: detailsField,
        notes: notesField,
        date: dateTimeField,
        priority: priorityField,
    };

    return { ...task, ...newFields };
}



export default domNewTaskCardMaker;