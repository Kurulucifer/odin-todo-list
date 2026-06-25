import { format } from "date-fns";

function domTaskMaker(task) {
    const taskCardTemplate = document.getElementById("task-card-template").content.querySelector(".task");
    const taskCard = taskCardTemplate.cloneNode(true);

    const taskCardClasses = taskCard.classList;
    taskCardClasses.add(`priority-${task.getField("priority")}`);

    if (task.getField("done")) {
        taskCardClasses.toggle("done");
    }

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
    notes.innerText = task.getField("notes"); // support line breaks
    date.textContent = format(task.getField("date"), "M/d");
    time.textContent = format(task.getField("date"), "H:mm");
    
    if (task.getField("type") === "checklist") {
        makeChecklistItems(taskCard, task);
        attachToggleItemListener(taskCard, task);
        attachItemCheckboxListeners(taskCard);
    }
    
    attachDeleteListener(deleteButton, taskCard, task);
    attachEditListener(editButton, taskCard, task);
    attachCompleteListener(completeButton, taskCard, task);
    attachExpandCollapseListener(expandCollapseButton, taskCard);

    return taskCard;
}

// Should this return instead?
// Maybe attach it in the main function
function makeChecklistItems(taskCard, task) {
    const checklistTemplate = document.getElementById("checklist-template").content.querySelector(".checklist");
    const checklist = checklistTemplate.cloneNode(true);

    const itemTemplateProto = checklist.querySelector(".checklist-item");
    const itemTemplate = itemTemplateProto.cloneNode(true)
    itemTemplateProto.remove();

    const addItemButton = checklist.querySelector(".add-checklist-item");
    addItemButton.remove();
    
    const checklistItems = task.getAllItems();
    for (const item of checklistItems) {
        const newItemRow = itemTemplate.cloneNode(true);
        const newItemCheckbox = newItemRow.querySelector(".item-checkbox");
        const newItemLabel = newItemRow.querySelector(".item-content");
        newItemLabel.textContent = item.label;

        if (item.done) {
            newItemCheckbox.checked = item.done;
            newItemRow.classList.toggle("done");
        }
        
        checklist.appendChild(newItemRow);
    }

    const border  = taskCard.querySelector(".border");
    border.after(checklist);
}

// Now that I'm thinking about it, it's kinda weird to 
// use a CustomEvent dispatcher and listening on the same
// exact card for this... I guess it makes more sense 
// semantically but I could do away with it.
// It could literally just go into the checkbox.addEventListener
function attachToggleItemListener(taskCard, task) {
    const checklist = taskCard.querySelector(".checklist");
    checklist.addEventListener('toggle-item', (e) => {
        task.toggleItem(e.detail.label);
        e.target.classList.toggle("done");
    })
}
function attachItemCheckboxListeners(taskCard) {
    const checklist = taskCard.querySelector(".checklist").querySelectorAll(".checklist-item");
    for (const item of checklist) {
        const checkbox = item.querySelector(".item-checkbox");
        const toggleItem = new CustomEvent('toggle-item', {
            bubbles: true,
            detail: {
                label: item.querySelector(".item-content").textContent,
            },
        });
        checkbox.addEventListener('change', () => {
            item.dispatchEvent(toggleItem);
        });
    }
}

function attachDeleteListener(deleteButton, taskCard, task) {
    const deleteCard = new CustomEvent('delete-card', {
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
    const editCard = new CustomEvent('edit-card', {
        bubbles: true,
        detail: {
            task: task,
        }
    });
    editButton.addEventListener('click', () => {
        taskCard.dispatchEvent(editCard);
    });
}

function attachCompleteListener(completeButton, taskCard, task) {
    const completeCard = new CustomEvent('complete-card', {
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