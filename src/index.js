import "./stylesheet.css";
import taskMaker from './task-maker.js';
import taskChecklistMaker from "./task-checklist-maker.js";

const name = "buy milk";
const date = new Date();
const details = "gotta buy milk from ralphs";
const notes = "remember to bring the coupon";
const priority = "3";

const task1 = taskMaker(name, date, details, notes, priority);
console.log(task1);
console.log(task1.getField("name"));
task1.updateField({name : "buy yogurt", details : "gotta buy yogurt from ralphs"});
console.log(task1.getAllFields());