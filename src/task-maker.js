// all strings except initDate, which is a Date object, probably?
// not sure what the priority levels should be yet
function taskMaker(taskFields = {}) {
    let task = {
        name: "New Task",
        date: new Date(),
        details: "Details",
        notes: "Notes", 
        priority: "low",
        done: false,
        type: "task",
        id: crypto.randomUUID(),
        ...taskFields,
    };

    const getField = (field) => task[field];

    const getAllFields = () => ( { ...task} );

    // thank you claude for teaching me the versatility of spread syntax
    // however I will need to format the input as objects in DOM module
    const updateField = (fields) => {
        task = {...task, ...fields}
    };

    const toggleDone = () => {
        task.done = !task.done;
    };
    
    return {
        getField,
        updateField,
        getAllFields,
        toggleDone,
    };
};

export default taskMaker;

