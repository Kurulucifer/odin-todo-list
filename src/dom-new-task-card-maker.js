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
    
    const newTaskCard = document.createElement("div");
    newTaskCard.className = "edit-task";
    newTaskCard.id = "new-task-card";

    const name = document.createElement("div");
    name.className = "name";
    name.contentEditable = "true";
    
    const dateTime = document.createElement("div");
    dateTime.className = "date-time";

    const dateInput = document.createElement("input");
    dateInput.className = "date-input";
    dateInput.type = "date";
    const date = document.createElement("div");
    date.className = "date";
    addDateListeners(date, dateInput);
    const timeInput = document.createElement("input");
    timeInput.className = "time-input";
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

    date.textContent = format(task.date, "M/d");
    dateInput.value = format(task.date, "yyyy-MM-dd");
    time.textContent = format(task.date, "H:mm");
    timeInput.value = format(task.date, "HH:mm");


    newTaskCard.appendChild(name);
    newTaskCard.appendChild(dateTime);
    newTaskCard.appendChild(details);
    newTaskCard.appendChild(border);
    newTaskCard.appendChild(notes);
    newTaskCard.appendChild(priority);
    newTaskCard.appendChild(finishButtons);

    addConfirmButtonListener(confirmButton, newTaskCard, task);
    addCancelButtonListener(cancelButton, newTaskCard, task);

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

export default domNewTaskCardMaker;