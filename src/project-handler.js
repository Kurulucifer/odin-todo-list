import projectMaker from "./project-maker.js";

const projectHandler = () => {
    const projectList = [];

    const makeProject = (initName, initDetails, initColor) => {
        const project = projectMaker(initName, initDetails, initColor);
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

    return {
        makeProject,
        getProject,
        removeProject,
        getProjectList,
    }
};

export default projectHandler;