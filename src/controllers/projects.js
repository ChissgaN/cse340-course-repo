// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

// How many upcoming projects the projects page lists.
const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };
