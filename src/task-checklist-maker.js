import taskMaker from './task-maker.js';

// initItems is an array of strings (labels)
function taskChecklistMaker(taskFields, initItems) {
    const task = taskMaker(taskFields);
    task.updateField( {type: "checklist"} );

    const items = initItems.map(label => ( { label: label, done: false} ));

    const getAllItems = () => [...items];

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