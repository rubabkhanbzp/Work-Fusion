const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const authController = require('./controllers/authController');
const projectController = require('./controllers/projectController');
const taskController = require('./controllers/taskController');
const User = require('./models/user'); 

require('dotenv').config();

// Connect to database
mongoose.connect('mongodb://localhost:27017/project-manager')
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Middleware to make user data available in all routes
app.use(async (req, res, next) => {
    res.locals.user = req.session.userId || null;
    if (req.session.userId) {
        try {
            req.user = await User.findById(req.session.userId);
        } catch (error) {
            console.error('Error fetching user from session:', error);
        }
    }
    next();
});

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home route
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user || null });
});

// Auth routes
app.get('/register', (req, res) => {
    res.render('register'); // Render the 'register.ejs' view
});
app.post('/register', authController.registerUser);

app.get('/login', (req, res) => {
    res.render('login'); // Render the 'login.ejs' view
});
app.post('/login', authController.loginUser);

app.get('/logout', authController.logoutUser);

// Ensure user is authenticated for the following routes
app.use((req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
});

// Project routes
app.post('/create', projectController.createProject); 
app.get('/projects', projectController.getAllProjects); 
app.get('/projects/:id', projectController.getProjectById); 
// Project route to render the project creation form
app.get('/create', (req, res) => {
    res.render('createProject'); 
});


// Render form to create a new task
app.get('/projects/:projectId/tasks/create', (req, res) => {
    res.render('createTask', { projectId: req.params.projectId });
});

// Handle task creation form submission
app.post('/projects/:projectId/tasks/create', taskController.createTask);

app.get('/projects/:projectId/tasks', taskController.getTasksByProject); // Updated to '/projects/:projectId/tasks'


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

