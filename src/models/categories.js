import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
      FROM public.category
      ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
}

/**
 * Gets one category by its id.
 */
const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name
      FROM public.category
      WHERE category_id = $1;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Gets every category a service project belongs to.
 *
 * A project can have several categories, so the link between the two lives in
 * project_category. The query walks that junction table to reach category.
 */
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
      FROM public.category c
      JOIN public.project_category pc ON pc.category_id = c.category_id
      WHERE pc.project_id = $1
      ORDER BY c.name;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Export the model functions
export { getAllCategories, getCategoryDetails, getCategoriesByProjectId }
