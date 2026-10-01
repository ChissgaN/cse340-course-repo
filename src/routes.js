import express from 'express';

import {
    registrationValidation,
    showUserRegistrationForm,
    processUserRegistrationForm
} from './controllers/users.js';

import { showHomePage } from './controllers/index.js';
import {
    organizationValidation,
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';
import {
    projectValidation,
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';
import {
    categoryValidation,
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route for the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for the new service project form
router.get('/new-project', showNewProjectForm);

// Route to handle new service project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Route for the edit service project form
router.get('/edit-project/:id', showEditProjectForm);

// Route to handle edit service project form submission
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Route for service project details page
router.get('/project/:id', showProjectDetailsPage);

// Routes for assigning categories to a service project.
// The activity names this URL two different ways, so both are accepted and
// both reach the same controllers.
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.get('/project/:projectId/assign-categories', showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', processAssignCategoriesForm);

// Route for the new category form
router.get('/new-category', showNewCategoryForm);

// Route to handle new category form submission
router.post('/new-category', categoryValidation, processNewCategoryForm);

// Route for the edit category form
router.get('/edit-category/:id', showEditCategoryForm);

// Route to handle edit category form submission
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);

// Route for the user registration form
router.get('/register', showUserRegistrationForm);

// Route to handle user registration form submission
router.post('/register', registrationValidation, processUserRegistrationForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;
