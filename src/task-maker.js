// all strings except initDate, which is a Date object, probably?
// not sure what the priority levels should be yet
function taskMaker(initName, initDate, initDetails, initNotes, initPriority) {
    let task = {
        type: "task",
        id: crypto.randomUUID(),
        name: initName,
        date: initDate,
        details: initDetails,
        notes: initNotes, 
        priority: initPriority,
        done: false,
    };

    const getField = (field) => task[field];

    const getAllFields = () => ( { ...task} );

    // thank you claude for teaching me the versatility of spread syntax
    // however I will need to format the input as objects in DOM module
    const updateField = (fields) => {
        task = {...task, ...fields}
    };
    
    return {
        getField,
        updateField,
        getAllFields,
    };
};

export default taskMaker;

