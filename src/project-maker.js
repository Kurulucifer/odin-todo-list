import taskMaker from "./task-maker.js";
import taskChecklistMaker from "./task-checklist-maker.js";

function projectMaker(projectFields = {}) {
    let project = {
        id: crypto.randomUUID(),
        name: "New Project",
        details: "Details",
        color: "blue",
        ...projectFields,
    }

    const taskList = [];

    const getField = (field) => project[field];

    const getAllFields = () => ( { ...project} );

    const updateField = (fields) => {
        project = {...project, ...fields}
    };

    const addTask = (taskFields = {}) => {
        const task = taskMaker(taskFields);
        taskList.push(task);
    };

    // DO THIS LATER!
    // const addTaskChecklist = (initName, initDate, initDetails, initNotes, initPriority, initItems) => {
    //     const taskChecklist = taskChecklistMaker(initName, initDate, initDetails, initNotes, initPriority, initItems);
    //     taskList.push(taskChecklist);
    // };

    const getTaskList = () => taskList;

    const getTask = (taskID) => {
        return taskList.find( (task) => task.getField("id") === taskID);
    };

    const removeTask = (taskID) => {
        const taskIndex = taskList.findIndex( (task) => task.getField("id") === taskID); 
        taskList.splice(taskIndex, 1);
    };
    
    return {
        getField,
        getAllFields,
        updateField,
        addTask,
        // addTaskChecklist,
        getTaskList,
        getTask,
        removeTask,
    };
}

export default projectMaker;