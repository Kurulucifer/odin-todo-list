import taskMaker from './js-task-maker.js';

function taskChecklistMaker(initTaskFields, initChecklist) {
    const task = taskMaker(initTaskFields);
    task.updateField( {type: "checklist"} );

    let items = [];

    if (initChecklist.load) {
        items = initChecklist.content;
    }
    else {
        items = initChecklist.content.map(label => ( { label: label, done: false} ));
    }

    const getAllItems = () => [...items];

    // it really doesn't matter if there's multiple
    // tasks with the same label...
    // could give them unique IDs but that's 
    // another mess waiting to happen...
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