import taskMaker from "./js-task-maker.js";
import taskChecklistMaker from "./js-task-checklist-maker.js";
import projectMaker from "./js-project-maker.js";

function todoStorage() {
    const saveProjects = (projects) => {
        // const objectList = [];
        // for (const project of projectList) {
        //     const projectObject = { ...project.getAllFields() }
        //     const taskList = [];
        //     for (const task of project.getTaskList()) {
        //         const taskObject = task.getAllFields();
        //         if (task.getField("type") === "checklist") {
        //             taskObject.checklist = {
        //                 load: true,
        //                 content: task.getAllItems(),
        //             };
        //         }
        //         taskList.push(taskObject);
        //     }
        //     projectObject.taskList = taskList;
        //     objectList.push(projectObject);
        // }
        // localStorage.setItem("projects", JSON.stringify(objectList));
        localStorage.setItem("projects", JSON.stringify(projects.saveObject()));
        
    }

    const loadProjects = () => {
        let savedObjects = [];
        const saved = localStorage.getItem("projects");
        if (saved) {
            savedObjects = JSON.parse(saved);
        }
        const projectList = [];
        for (const projectObject of savedObjects) {
            const { taskList, ...projectFields } = projectObject;
            const project = projectMaker(projectFields);
            for (const taskObject of taskList) {
                let taskFields = {};
                let extra = {};
                if (taskObject.type === "checklist") {
                    const { checklist, ...rest } = taskObject;
                    taskFields = rest;
                    extra.checklist = checklist;
                }
                else {
                    taskFields = { ...taskObject };
                }
                project.addTask(taskFields, extra);
            }
            projectList.push(project);
        }
        return projectList;
    }
    
    return {
        saveProjects,
        loadProjects,
    }
}

export default todoStorage;