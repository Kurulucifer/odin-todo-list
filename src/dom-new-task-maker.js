import { add, format, parse, set } from "date-fns";

function domNewTaskCardMaker(taskFields = {}) {

    // this will add "id", "type", "done"
    // if they are available from an existing task while editing
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
    const time = editTaskCard.querySelector(".time");
    const timeInput = editTaskCard.querySelector(".time-input");
    attachDateListeners(date, dateInput);
    attachTimeListeners(time, timeInput);
    
    // pre-filling
    const name = editTaskCard.querySelector(".name");
    const details = editTaskCard.querySelector(".details");
    const notes = editTaskCard.querySelector(".notes");
    const prioritySelect = editTaskCard.querySelector("select[name='priority']");
    const makeChecklist = editTaskCard.querySelector(".make-checklist");
    const makeChecklistCheckbox = makeChecklist.querySelector(".checklist-checkbox");

    name.textContent = task.name;
    details.textContent = task.details;
    notes.innerText = task.notes;
    prioritySelect.value = task.priority;

    date.textContent = format(task.date, "M/d");
    dateInput.value = format(task.date, "yyyy-MM-dd");
    time.textContent = format(task.date, "H:mm");
    timeInput.value = format(task.date, "HH:mm");

    // existing checklist tasks
    if (task.id && task.type === "checklist") {
        makeChecklistCheckbox.checked = true;
        makeChecklistCheckbox.disabled = true; // sorry, no type intercoversion (yet)
        const { checklist: existingChecklist, itemTemplateBlank: itemTemplate } = makeNewChecklist();
        fillExistingChecklist(existingChecklist, itemTemplate, task);
        makeChecklist.after(existingChecklist);
    }
    // existing regular tasks
    else if (task.id && task.type === "task") {
        makeChecklist.remove();
    }
    // new task
    else {
        attachChecklistListener(makeChecklist, editTaskCard);
    }
    
    // button event listeners
    const confirmButton = editTaskCard.querySelector(".confirm-button");
    const cancelButton = editTaskCard.querySelector(".cancel-button");
    attachConfirmButtonListener(confirmButton, editTaskCard, task);
    attachCancelButtonListener(cancelButton, editTaskCard, task);

    return editTaskCard;
}

function attachChecklistListener(makeChecklist, editTaskCard) {
    const checkbox = makeChecklist.querySelector(".checklist-checkbox");
    checkbox.addEventListener('change', () => {
        const checklist = editTaskCard.querySelector(".checklist");
        if (checklist) {
            checklist.remove();
        }
        else {
            const newChecklist = makeNewChecklist().checklist;
            makeChecklist.after(newChecklist);
        }
    })
}

function fillExistingChecklist(checklist, itemTemplate, task) {
    const addItemButton = checklist.querySelector(".add-checklist-item");
    for (const item of task.checklist) {
        const newItem = itemTemplate.cloneNode(true);
        const deleteButton = newItem.querySelector(".item-delete");
        const newItemLabel = newItem.querySelector(".item-content");
        attachDeleteItemListener(deleteButton)
        newItemLabel.textContent = item.label;
        checklist.insertBefore(newItem, addItemButton);
    }

}

function makeNewChecklist() {
    const checklistTemplate = document.getElementById("edit-checklist-template").content.querySelector(".checklist");
    const checklist = checklistTemplate.cloneNode(true);
    const itemTemplateProto = checklist.querySelector(".checklist-item");
    const itemTemplateBlank = itemTemplateProto.cloneNode(true)
    itemTemplateProto.remove();

    const addItemButton = checklist.querySelector(".add-checklist-item");

    attachCreateItemListener(addItemButton, checklist, itemTemplateBlank);

    return { checklist, itemTemplateBlank };
}

function attachCreateItemListener(addItemButton, checklist, itemTemplateBlank) {
    const itemTemplate = itemTemplateBlank.cloneNode(true);
    const itemTemplateLabel = itemTemplate.querySelector(".item-content");
    itemTemplateLabel.textContent = "New checklist item";

    addItemButton.addEventListener('click', () => {
        const newItem = itemTemplate.cloneNode(true);
        attachDeleteItemListener(newItem.querySelector(".item-delete"));
        checklist.insertBefore(newItem, addItemButton);
    });
}

function attachDeleteItemListener(delItemButton) {
    delItemButton.addEventListener('click', () => {
        delItemButton.parentNode.remove();
    });
}

function attachDateListeners(dateDisplay, dateInput) {
    dateDisplay.addEventListener('click', () => dateInput.showPicker());
    dateInput.addEventListener('change', () => {
        const dateObject = parse(dateInput.value, "yyyy-MM-dd", new Date());
        dateDisplay.textContent = format(dateObject, "M/d");
    });
}

function attachTimeListeners(timeDisplay, timeInput) {
    timeDisplay.addEventListener('click', () => timeInput.showPicker());
    timeInput.addEventListener('change', () => {
        const timeObject = parse(timeInput.value, "HH:mm", new Date());
        timeDisplay.textContent = format(timeObject, "H:mm");
    });
}

function attachConfirmButtonListener(confirmButton, currentCard, task) {
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

function attachCancelButtonListener(cancelButton, currentCard, task) {
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
    // Add defaults again in case they were erased
    const nameField = currentCard.querySelector(".name").textContent.trim() || "New Task";
    const detailsField = currentCard.querySelector(".details").textContent.trim() || "Details";
    const notesField = currentCard.querySelector(".notes").innerText.trim() || "Notes"; // support line breaks
    const priorityField = currentCard.querySelector("select[name='priority']").value;

    const dateInputValue = currentCard.querySelector(".date-input").value;
    const date = parse(dateInputValue, "yyyy-MM-dd", new Date());

    const timeInputValue = currentCard.querySelector(".time-input").value;
    const time = parse(timeInputValue, "HH:mm", new Date());

    const dateTimeField = set(date, {
        hours: time.getHours(),
        minutes: time.getMinutes(),
    });

    // checklist
    const checklistField = [];
    const checklist = currentCard.querySelector(".checklist");
    if (checklist) {
        const checklistItems = checklist.querySelectorAll(".checklist-item");
        for (const item of checklistItems) {
            const label = item.querySelector(".item-content").textContent.trim() || "New checklist item";
            checklistField.push(label);
        }
    }

    // MAYBE add functionality to save item done status through edits...

    const newFields = {
        name: nameField,
        details: detailsField,
        notes: notesField,
        date: dateTimeField,
        priority: priorityField,
        checklist: checklistField,
    };

    return { ...task, ...newFields };
}

export default domNewTaskCardMaker;