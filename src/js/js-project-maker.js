import taskMaker from "./js-task-maker.js";
import taskChecklistMaker from "./js-task-checklist-maker.js";

function projectMaker(projectFields = {}) {
    let project = {
        id: crypto.randomUUID(),
        name: "New Project",
        details: "This is a new project.",
        color: "blue",
        ...projectFields,
    }

    const taskList = [];

    const getField = (field) => project[field];

    const getAllFields = () => ( { ...project} );

    const updateField = (fields) => {
        project = {...project, ...fields}
    };

    const addTask = (taskFields = {}, extra = {}) => {
        let task = {};

        if (extra.checklist) {
            task = taskChecklistMaker(taskFields, extra.checklist);
        }
        else {
            task = taskMaker(taskFields);
        }

        taskList.push(task);
    };

    const getTaskList = () => taskList;

    const getTask = (taskID) => {
        return taskList.find( (task) => task.getField("id") === taskID);
    };

    const removeTask = (taskID) => {
        const taskIndex = taskList.findIndex( (task) => task.getField("id") === taskID); 
        taskList.splice(taskIndex, 1);
    };
    
    const sortTasks = () => {
        taskList.sort( (a, b) => {
            const priorities = {
                low: 1,
                medium: 2,
                high: 3,
            }
            return (priorities[b.getField("priority")] * !b.getField("done") - priorities[a.getField("priority")] * !a.getField("done"));
        })
    };

    const saveObject = () => {
        return { ...getAllFields(), taskList: taskList.map(task => task.saveObject()) };
    }
    
    return {
        getField,
        getAllFields,
        updateField,
        addTask,
        getTaskList,
        getTask,
        removeTask,
        sortTasks,
        saveObject,
    };
}



export default projectMaker;