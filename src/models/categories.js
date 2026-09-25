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

/**
 * Links one category to one project in the junction table.
 * Not exported: only updateCategoryAssignments below uses it.
 */
const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO public.project_category (project_id, category_id)
      VALUES ($1, $2);
    `;

    const queryParams = [projectId, categoryId];
    await db.query(query, queryParams);
};

/**
 * Replaces a project's categories with the given list.
 *
 * Delete-then-insert rather than working out which links to add and which to
 * remove: the set is tiny, and this cannot leave a stale row behind. An empty
 * array is meaningful - it clears every category from the project.
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM public.project_category
      WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

/**
 * Creates a new category.
 * @param {string} name - The name of the category.
 * @returns {number} The id of the newly created category record.
 */
const createCategory = async (name) => {
    const query = `
        INSERT INTO public.category (name)
      VALUES ($1)
      RETURNING category_id;
    `;

    const queryParams = [name];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

/**
 * Updates an existing category.
 * @param {number} id - The id of the category to update.
 * @param {string} name - The new name of the category.
 * @returns {number} How many rows were changed - 0 means no category had that id.
 */
const updateCategory = async (id, name) => {
    const query = `
        UPDATE public.category
      SET name = $1
      WHERE category_id = $2;
    `;

    const queryParams = [name, id];
    const result = await db.query(query, queryParams);

    return result.rowCount;
};

// Export the model functions
export {
    getAllCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
}
