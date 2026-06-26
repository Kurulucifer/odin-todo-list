import domProjectMaker from "./dom-project-maker.js";

const domProjectsHandler = (projects) => {
    const projectsCard = document.getElementById("projects");

    if (projects.getProjectList().length === 0) {
        projects.makeProject();
    }

    const addProjectButton = projectsCard.querySelector(".add-project-button");

    attachAddProjectListener(addProjectButton, projectsCard, projects);
    attachEditProjectListener(projectsCard);
    attachSaveProjectListener(projectsCard, projects);
    attachDeleteProjectListener(projectsCard, projects);
    
    refreshProjectList(projectsCard, projects);
};

function attachAddProjectListener(addProjectButton, projectsCard, projects) {
    addProjectButton.addEventListener('click', () => {
        projects.makeProject();
        refreshProjectList(projectsCard, projects);
        const newestProject = addProjectButton.parentNode.previousElementSibling;
        editProject(projectsCard, newestProject);
    })
}

function attachEditProjectListener(projectsCard) {
    projectsCard.addEventListener('edit-project', (e) => editProject(projectsCard, e.target));
}

function attachSaveProjectListener(projectsCard, projects) {
    projectsCard.addEventListener('save-project', (e) => {
        saveProject(e.target, projects.getProject(e.detail.projectID));
        refreshProjectList(projectsCard, projects);
    });
}

function attachDeleteProjectListener(projectsCard, projects) {
    projectsCard.addEventListener('delete-project', (e) => {
        projects.removeProject(e.detail.projectID);
        e.target.remove();
        refreshProjectList(projectsCard, projects);
    });
}

function editProject(projectsCard, projectCard) {
    const name = projectCard.querySelector(".name");
    const details = projectCard.querySelector(".details");
    name.contentEditable = true;
    details.contentEditable = true;
    toggleProjectButtons(projectCard);

    const editButtons = projectsCard.querySelectorAll(".edit-project-button");
    editButtons.forEach(button => button.disabled = true);
}

function saveProject(projectCard, project) {
    const name = projectCard.querySelector(".name");
    const details = projectCard.querySelector(".details");
    name.contentEditable = false;
    details.contentEditable = false;

    const nameField = name.textContent.trim() || "Project";
    const detailsField = details.textContent.trim() || "Details";

    project.updateField( {name: nameField, details: detailsField} );
}

function toggleProjectButtons(projectCard) {
    const editButton = projectCard.querySelector(".edit-project-button");
    const saveButton = projectCard.querySelector(".save-project-button");
    const deleteButton = projectCard.querySelector(".delete-project-button");
    saveButton.classList.toggle("hidden");
    deleteButton.classList.toggle("hidden");
    editButton.classList.toggle("hidden");
}

function refreshProjectList(projectsCard, projects) {
    const projectList = projects.getProjectList();
    const addProjectButton = projectsCard.querySelector(".add-project");
    projectsCard.querySelectorAll(".project").forEach(project => project.remove());

    for (const project of projectList) {
        const domProject = domProjectMaker(project);
        projectsCard.insertBefore(domProject, addProjectButton);
    }

    const updateStorage = new CustomEvent('update-storage', {
        bubbles: true,
    });
    projectsCard.dispatchEvent(updateStorage);
}

export default domProjectsHandler;