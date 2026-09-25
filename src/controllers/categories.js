// Import any needed model functions
import { body, validationResult } from 'express-validator';
import {
    getAllCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';

/**
 * Server-side validation rules for a category.
 *
 * The minimum length is deliberately absent from the form markup, so a short
 * name reaches the server and this is what rejects it.
 */
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters.')
];

// PostgreSQL error code for a unique constraint violation.
const UNIQUE_VIOLATION = '23505';

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

const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title, activePage: 'categories' });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    const { name } = req.body ?? {};

    try {
        await createCategory(name);
    } catch (error) {
        // category.name is UNIQUE, so a repeated name is a user mistake rather
        // than a server fault. Anything else is genuinely unexpected.
        if (error.code === UNIQUE_VIOLATION) {
            req.flash('error', 'A category with that name already exists.');
            return res.redirect('/new-category');
        }
        throw error;
    }

    req.flash('success', 'Category added successfully!');

    res.redirect('/categories');
};

const showEditCategoryForm = async (req, res, next) => {
    const categoryId = Number(req.params.id);

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

    const title = 'Edit Category';

    res.render('edit-category', { title, activePage: 'categories', category });
};

const processEditCategoryForm = async (req, res, next) => {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId)) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body ?? {};
    let rowsUpdated = 0;

    try {
        rowsUpdated = await updateCategory(categoryId, name);
    } catch (error) {
        if (error.code === UNIQUE_VIOLATION) {
            req.flash('error', 'A category with that name already exists.');
            return res.redirect(`/edit-category/${categoryId}`);
        }
        throw error;
    }

    if (rowsUpdated === 0) {
        const err = new Error('Page Not Found');
        err.status = 404;
        return next(err);
    }

    req.flash('success', 'Category updated successfully!');

    res.redirect(`/category/${categoryId}`);
};

// Export any controller functions
export {
    categoryValidation,
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};
