// Import any needed model functions
import {
    getAllCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, activePage: 'categories', categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = Number(req.params.id);

    // A non-numeric id would fail inside PostgreSQL, and an id with no matching
    // row is simply a page that does not exist. Both are 404s, not 500s.
    if (!Number.isInteger(categoryId)) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    const category = await getCategoryDetails(categoryId);

    if (category === null) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';

    res.render('category', { title, activePage: 'categories', category, projects });
};

const showAssignCategoriesForm = async (req, res, next) => {
    const projectId = Number(req.params.projectId);

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

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    // The view needs to know which boxes to tick. Comparing ids against a Set
    // is simpler in the template than searching the array for every category.
    const assignedCategoryIds = assignedCategories.map((category) => category.category_id);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
        title,
        activePage: 'projects',
        project,
        categories,
        assignedCategoryIds
    });
};

const processAssignCategoriesForm = async (req, res, next) => {
    const projectId = Number(req.params.projectId);

    if (!Number.isInteger(projectId)) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    // Checkboxes arrive three different ways: absent when none are ticked, a
    // single string when exactly one is, and an array when several are. Nothing
    // downstream should have to care, so normalise to an array here.
    const submitted = req.body?.categoryIds;
    let categoryIds = [];

    if (Array.isArray(submitted)) {
        categoryIds = submitted;
    } else if (submitted !== undefined) {
        categoryIds = [submitted];
    }

    await updateCategoryAssignments(projectId, categoryIds);

    req.flash('success', 'Categories updated successfully!');

    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
