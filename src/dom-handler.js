import domTaskMaker from "./dom-task-maker.js";
import domProjectMaker from "./dom-project-maker.js";
import projectHandler from "./project-handler.js";

const domHandler = () => {
    
};

const task1Name = "buy milk";
const task1Date = new Date();
const task1Details = "gotta buy milk from ralphs";
const task1Notes = "remember to bring the coupon";
const task1Priority = "3";

const projectName = "Default";
const projectDetails = "This is the default project.";
const projectColor = "green";

const project = projectMaker(projectName, projectDetails, projectColor);
project.addTask(task1Name, task1Date, task1Details, task1Name, task1Notes, task1Priority);

export default domHandler;