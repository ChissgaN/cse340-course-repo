// Import any needed model functions
import { getAllCategories, getCategoryDetails } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';

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

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };
