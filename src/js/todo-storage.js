import projectMaker from "./js-project-maker.js";

function todoStorage() {
    const saveProjects = (projects) => {
        localStorage.setItem("projects", JSON.stringify(projects.saveObject()));
    };

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
    };
    
    return {
        saveProjects,
        loadProjects,
    }
}

export default todoStorage;