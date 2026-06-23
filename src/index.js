import "./stylesheet.css";
import domNewTaskCardMaker from "./dom-new-task-card-maker.js";

const newCard = domNewTaskCardMaker();

const project = document.getElementById("default");
project.addEventListener('card-saved', (e) => {
    console.log(e.detail.task);
})

project.addEventListener('discard-changes', (e) => {
    console.log("Throw away!");
})

const taskList = document.getElementById("1");
taskList.prepend(newCard);

