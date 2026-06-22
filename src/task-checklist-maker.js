import taskMaker from './task-maker.js';

// initItems is an array of strings (labels)
function taskChecklistMaker(initName, initDate, initDetails, initNotes, initPriority, initItems) {
    const task = taskMaker(initName, initDate, initDetails, initNotes, initPriority);

    let items = initItems.map(label => ( { label: label, done: false} ));

    const getAllItems = () => [...items];

    // somehow gonna have to map index to checklist item in DOM module
    // also remember to cross out the label in DOM module
    // also maybe move completed items down visually in DOM module
    const toggleItem = (index) => {
        items[index].done = !items[index].done;
    };
    
    const addItem = (label) => {
        items.push( {label: label, done: false} );
    };
    
    const removeItem = (index) => {
        items.splice(index, 1);
    };

    return {
        ...task,
        getAllItems,
        toggleItem,
        addItem,
        removeItem,
    }
}

export default taskChecklistMaker;