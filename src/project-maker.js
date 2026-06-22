import taskMaker from "./task-maker.js";
import taskChecklistMaker from "./task-checklist-maker.js";

function projectMaker(initName, initDetails, initColor) {
    let project = {
        name: initName,
        notes: initDetails,
        color: initColor,
    }

    const taskList = [];

    const getField = (field) => project[field];

    const getAllFields = () => ( { ...task} );

    const updateField = (fields) => {
        project = {...project, ...fields}
    };

    const addTask = (initName, initDate, initDetails, initNotes, initPriority) => {
        const task = taskMaker(initName, initDate, initDetails, initNotes, initPriority);
        taskList.push(task);
    };

    const addTaskChecklist = (initName, initDate, initDetails, initNotes, initPriority, initItems) => {
        const taskChecklist = taskChecklistMaker(initName, initDate, initDetails, initNotes, initPriority, initItems);
        taskList.push(taskChecklist);
    };

    const getTaskList = () => taskList;

    const getTask = (taskID) => {
        taskList.find( (task) => task.getField("id") === taskID);
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
        addTaskChecklist,
        getTaskList,
        getTask,
        removeTask,
    };
}

export default projectMaker;