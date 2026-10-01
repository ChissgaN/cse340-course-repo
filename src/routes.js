import express from 'express';

import {
    registrationValidation,
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
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
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// Route for the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);

// Route to handle edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for the new service project form
router.get('/new-project', requireRole('admin'), showNewProjectForm);

// Route to handle new service project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Route for the edit service project form
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);

// Route to handle edit service project form submission
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// Route for service project details page
router.get('/project/:id', showProjectDetailsPage);

// Routes for assigning categories to a service project.
// The activity names this URL two different ways, so both are accepted and
// both reach the same controllers.
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);
router.get('/project/:projectId/assign-categories', requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', requireRole('admin'), processAssignCategoriesForm);

// Route for the new category form
router.get('/new-category', requireRole('admin'), showNewCategoryForm);

// Route to handle new category form submission
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

// Route for the edit category form
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);

// Route to handle edit category form submission
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);

// Route for the user registration form
router.get('/register', showUserRegistrationForm);

// Route to handle user registration form submission
router.post('/register', registrationValidation, processUserRegistrationForm);

// Routes for signing in and out
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// Admin-only list of registered users. requireLogin sends a signed-out
// visitor to the sign-in page; requireRole sends a signed-in non-admin back
// to the dashboard they came from.
router.get('/users', requireLogin, requireRole('admin', '/dashboard'), showUsersPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;
