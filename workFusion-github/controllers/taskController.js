const Task = require('../models/Task');
const Project = require('../models/project');

// Create a new task within a project
exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const projectId = req.params.projectId; 

        // Create a new task associated with the project
        const task = new Task({ title, description, project: projectId });
        await task.save();

        // Find the project and add the task to it
        const project = await Project.findById(projectId);
        if (project) {
            project.tasks.push(task._id); 
            await project.save();
        }

        res.redirect(`/projects/${projectId}`);
    } catch (err) {
        console.error(err);
        res.status(400).send('Error creating task');
    }
};


// View tasks in a project
exports.getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId });
        res.render('tasks', { tasks });
    } catch (err) {
        res.status(400).send(err);
    }
};
