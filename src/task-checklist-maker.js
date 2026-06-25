import taskMaker from './task-maker.js';

// initItems is an array of strings (labels)
function taskChecklistMaker(taskFields, initItems) {
    const task = taskMaker(taskFields);
    task.updateField( {type: "checklist"} );

    let items = initItems.map(label => ( { label: label, done: false} ));

    const getAllItems = () => [...items];

    const toggleItem = (label) => {
        const filtered = items.filter( (item) => item.label === label );
        for (const item of filtered) {
            item.done = !item.done;
        }
    };
    
    const addItem = (label) => {
        items.push( {label: label, done: false} );
    };

    const resetItems = () => {
        items = [];
    }

    const getAllFields = () => ( { ...task.getAllFields(), checklist: [...items] } )

    return {
        ...task,
        getAllItems,
        toggleItem,
        addItem,
        resetItems,
        getAllFields,
    }
}

export default taskChecklistMaker;