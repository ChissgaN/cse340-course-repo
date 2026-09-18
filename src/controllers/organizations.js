// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
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

// Export any controller functions
export { showOrganizationsPage, showOrganizationDetailsPage };
