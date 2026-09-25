// Import any needed model functions
import { body, validationResult } from 'express-validator';
import { getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

// How many upcoming projects the projects page lists.
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/**
 * Server-side validation rules for a service project.
 *
 * These run as middleware before the controller, collecting any problems so
 * validationResult(req) can report them. They repeat the checks the browser
 * already makes, because the browser's are trivial to bypass.
 */
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required.')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters.'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required.')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters.'),
    body('date')
        .notEmpty().withMessage('Date is required.')
        .isDate().withMessage('Date must be a valid date.'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required.')
        .isInt().withMessage('Organization must be selected from the list.')
];

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, activePage: 'projects', projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    const projectId = Number(req.params.id);

    // A non-numeric id would fail inside PostgreSQL, and an id with no matching
    // row is simply a page that does not exist. Both are 404s, not 500s.
    if (!Number.isInteger(projectId)) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    const project = await getProjectDetails(projectId);

    if (project === null) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    const categories = await getCategoriesByProjectId(projectId);
    const title = 'Service Project Details';

    res.render('project', { title, activePage: 'projects', project, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, activePage: 'projects', organizations });
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    await createProject(title, description, location, date, organizationId);

    req.flash('success', 'Service project added successfully!');

    res.redirect('/projects');
};

// Export any controller functions
export {
    projectValidation,
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm
};
