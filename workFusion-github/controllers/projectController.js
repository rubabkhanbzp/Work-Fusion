const Project = require('../models/project');
const User = require('../models/user');

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const project = new Project({ name, description, members });
        await project.save();
        res.redirect('/projects');
    } catch (err) {
        res.status(400).send(err);
    }
};

// View all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('tasks');
        res.render('projects', { projects });
    } catch (err) {
        res.status(400).send(err);
    }
};

// View a single project
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('tasks');
        res.render('project', { project });
    } catch (err) {
        res.status(400).send(err);
    }
};
