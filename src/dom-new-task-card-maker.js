import { format, parse } from "date-fns";

function domNewTaskCardMaker(taskFields = {}) {
    let task = {
        type: "task",
        id: "",
        name: "New Task",
        date: null,
        details: "Details",
        notes: "Notes", 
        priority: "low",
        done: false,
    };

    // maybe delete "done" key because it's unnecessary
    task = { ...task, ...taskFields }
    
    const newTaskCard = document.createElement("div");
    newTaskCard.className = "edit-task";

    const name = document.createElement("div");
    name.className = "name";
    name.contentEditable = "true";
    
    const dateTime = document.createElement("div");
    dateTime.className = "date-time";

    const dateInput = document.createElement("input");
    dateInput.className = "dateInput";
    dateInput.type = "date";
    const date = document.createElement("div");
    date.className = "date";
    addDateListeners(date, dateInput);
    const timeInput = document.createElement("input");
    timeInput.className = "timeInput";
    timeInput.type = "time";
    const time = document.createElement("div");
    time.className = "time";
    addTimeListeners(time, timeInput);

    dateTime.appendChild(dateInput);
    dateTime.appendChild(date);
    dateTime.appendChild(timeInput);
    dateTime.appendChild(time);

    const details = document.createElement("div");
    details.className = "details";
    details.contentEditable = "true";

    const border = document.createElement("hr");

    const notes = document.createElement("div");
    notes.className = "notes";
    notes.contentEditable = "true";

    const priority = document.createElement("div");
    priority.className = "priority";
    const priorityLabel = document.createElement("label");
    priorityLabel.htmlFor = "priority-select";
    priorityLabel.textContent = "Priority";
    const prioritySelect = document.createElement("select");
    prioritySelect.name = "priority";
    prioritySelect.id= "priority-select";
    const optionLow = document.createElement("option");
    optionLow.value = "low";
    optionLow.textContent = "Low";
    const optionMedium = document.createElement("option");
    optionMedium.value = "medium";
    optionMedium.textContent = "Medium";
    const optionHigh = document.createElement("option");
    optionHigh.value = "high";
    optionHigh.textContent = "High";
    prioritySelect.appendChild(optionLow);
    prioritySelect.appendChild(optionMedium);
    prioritySelect.appendChild(optionHigh);
    priority.appendChild(priorityLabel);
    priority.appendChild(prioritySelect);
    
    const finishButtons = document.createElement("div");
    finishButtons.className = "finish-buttons";
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    finishButtons.appendChild(confirmButton);
    finishButtons.appendChild(cancelButton);

    // pre-filling

    name.textContent = task.name;
    details.textContent = task.details;
    notes.textContent = task.notes;
    prioritySelect.value = task.priority;

    if (!task.date) {
        const currentDate = new Date();
        task.date = currentDate;
        date.textContent = format(currentDate, "M/d");
        dateInput.value = format(currentDate, "yyyy-MM-dd");
        time.textContent = format(currentDate, "H:mm");
        timeInput.value = format(currentDate, "HH:mm");
    }
    else {
        date.textContent = format(task.date, "M/d");
        dateInput.value = format(task.date, "yyyy-MM-dd");
        time.textContent = format(task.date, "H:mm");
        timeInput.value = format(task.date, "HH:mm");
    }

    newTaskCard.appendChild(name);
    newTaskCard.appendChild(dateTime);
    newTaskCard.appendChild(details);
    newTaskCard.appendChild(border);
    newTaskCard.appendChild(notes);
    newTaskCard.appendChild(priority);
    newTaskCard.appendChild(finishButtons);

    addConfirmButtonListener(confirmButton, !task.id, newTaskCard, task);
    addCancelButtonListener(cancelButton, !task.id, newTaskCard)

    return newTaskCard;
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

function addConfirmButtonListener(confirmButton, isNew, currentCard, task) {
    confirmButton.addEventListener('click', () => {
        const updatedTask = updateTaskFields(currentCard, task);
        const cardSaved = new CustomEvent("card-saved", {
            bubbles: true,
            detail: {
                new: isNew,
                task: updatedTask,
            }
        });
        currentCard.dispatchEvent(cardSaved);
    })
}

function updateTaskFields(currentCard, task) {
    const nameField = currentCard.querySelector(".name").textContent.trim() || "New Task";
    const detailsField = currentCard.querySelector(".details").textContent.trim() || "Details";
    const notesField = currentCard.querySelector(".notes").textContent.trim() || "Notes";

    const newFields = {
        name: nameField,
        details: detailsField,
        notes: notesField,
    }

    return { ...task, ...newFields };
}

function addCancelButtonListener(cancelButton, isNew, currentCard) {
    cancelButton.addEventListener('click', () => {
        if (isNew) {
            currentCard.remove();
        }
        else {
            const discardChanges = new CustomEvent("discard-changes", {
                bubbles: true,
            });
            currentCard.dispatchEvent(discardChanges);
        }
    })
}

export default domNewTaskCardMaker;