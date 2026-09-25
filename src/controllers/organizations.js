// Import any needed model functions
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define any controller functions
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, activePage: 'organizations', organizations });
};

const showOrganizationDetailsPage = async (req, res, next) => {
    const organizationId = Number(req.params.id);

    // A non-numeric id would reach PostgreSQL and fail there, so reject it here.
    // Either way - bad id or no matching row - the page simply does not exist,
    // so hand a 404 to the global error handler rather than a 500.
    if (!Number.isInteger(organizationId)) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    const organizationDetails = await getOrganizationDetails(organizationId);

    if (organizationDetails === null) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', {
        title,
        activePage: 'organizations',
        organizationDetails,
        projects
    });
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title, activePage: 'organizations' });
};

const processNewOrganizationForm = async (req, res) => {
    const { name, description, contactEmail } = req.body ?? {};
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

    // Set a success flash message
    req.flash('success', 'Organization added successfully!');

    res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res, next) => {
    const organizationId = Number(req.params.id);

    if (!Number.isInteger(organizationId)) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    const organizationDetails = await getOrganizationDetails(organizationId);

    if (organizationDetails === null) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    const title = 'Edit Organization';

    res.render('edit-organization', {
        title,
        activePage: 'organizations',
        organizationDetails
    });
};

const processEditOrganizationForm = async (req, res, next) => {
    const organizationId = Number(req.params.id);

    if (!Number.isInteger(organizationId)) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    const { name, description, contactEmail, logoFilename } = req.body ?? {};

    const rowsUpdated = await updateOrganization(
        organizationId,
        name,
        description,
        contactEmail,
        logoFilename
    );

    // rowCount of 0 means no organization carries that id, so there was
    // nothing to edit - the same 404 the details page would give.
    if (rowsUpdated === 0) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    req.flash('success', 'Organization updated successfully!');

    res.redirect(`/organization/${organizationId}`);
};

// Export any controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
};
