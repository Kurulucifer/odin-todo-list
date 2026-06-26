import projectMaker from "./js-project-maker.js";

function projectsHandler(existingProjectList = []) {
    const projectList = [...existingProjectList];

    const makeProject = (projectFields = {}) => {
        const project = projectMaker(projectFields);
        projectList.push(project);
    };

    const getProject = (projectID) => {
        return projectList.find( (project) => project.getField("id") === projectID);
    };

    const removeProject = (projectID) => {
        const projectIndex = projectList.findIndex( (project) => project.getField("id") === projectID); 
        projectList.splice(projectIndex, 1);
    };

    const getProjectList = () => [...projectList];

    const saveObject = () => {
        console.log(projectList.map(project => project.saveObject()));
        return projectList.map(project => project.saveObject());
    }

    return {
        makeProject,
        getProject,
        removeProject,
        getProjectList,
        saveObject,
    };
}

export default projectsHandler;