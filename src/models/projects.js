import db from './db.js'

/**
 * Gets every service project together with the name of the organization
 * that sponsors it.
 *
 * The JOIN is what brings the two tables together: project stores only the
 * organization_id, so we look up the matching row in organization to get
 * the readable name.
 */
const getAllProjects = async() => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date,
               o.organization_id, o.name AS organization_name
          FROM public.project p
          JOIN public.organization o ON o.organization_id = p.organization_id
      ORDER BY p.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
}

/**
 * Gets the service projects sponsored by one organization.
 *
 * No JOIN here: the caller already knows which organization it asked for,
 * so looking up the name again would be wasted work.
 */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM project
        WHERE organization_id = $1
        ORDER BY project_date;
      `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

/**
 * Gets the next upcoming service projects, soonest first.
 *
 * CURRENT_DATE is evaluated by PostgreSQL, so "upcoming" is decided by the
 * database clock rather than the server's. LIMIT takes a placeholder too, so
 * the caller chooses how many without the number ever touching the SQL text.
 */
const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT
          p.project_id,
          p.title,
          p.description,
          p.location,
          p.project_date,
          o.organization_id,
          o.name AS organization_name
        FROM project p
        JOIN organization o ON o.organization_id = p.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
      `;

    const queryParams = [numberOfProjects];
    const result = await db.query(query, queryParams);

    return result.rows;
};

/**
 * Gets one service project by its id, with the name of its organization.
 */
const getProjectDetails = async (projectId) => {
    const query = `
        SELECT
          p.project_id,
          p.title,
          p.description,
          p.location,
          p.project_date,
          o.organization_id,
          o.name AS organization_name
        FROM project p
        JOIN organization o ON o.organization_id = p.organization_id
        WHERE p.project_id = $1;
      `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Gets every service project in one category.
 *
 * Two joins: project_category holds the project/category links, and
 * organization supplies the sponsor name for each project.
 */
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
          p.project_id,
          p.title,
          p.description,
          p.location,
          p.project_date,
          o.organization_id,
          o.name AS organization_name
        FROM project p
        JOIN project_category pc ON pc.project_id = p.project_id
        JOIN organization o ON o.organization_id = p.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
      `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

/**
 * Creates a new service project.
 * @param {string} title - The title of the project.
 * @param {string} description - A description of the project.
 * @param {string} location - Where the project takes place.
 * @param {string} date - The date of the project, as YYYY-MM-DD.
 * @param {number} organizationId - The organization sponsoring the project.
 * @returns {number} The id of the newly created project record.
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    return result.rows[0].project_id;
};

/**
 * Updates an existing service project.
 *
 * organization_id is part of the update, so a project can be reassigned to a
 * different sponsoring organization.
 *
 * @param {number} id - The id of the project to update.
 * @param {string} title - The title of the project.
 * @param {string} description - A description of the project.
 * @param {string} location - Where the project takes place.
 * @param {string} date - The date of the project, as YYYY-MM-DD.
 * @param {number} organizationId - The organization sponsoring the project.
 * @returns {number} The id of the updated project.
 */
const updateProject = async (id, title, description, location, date, organizationId) => {
    const query = `
      UPDATE project
      SET title = $1,
          description = $2,
          location = $3,
          project_date = $4,
          organization_id = $5
      WHERE project_id = $6
      RETURNING project_id
    `;

    const queryParams = [title, description, location, date, organizationId, id];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }

    return result.rows[0].project_id;
};

// Export the model functions
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByCategoryId,
    createProject,
    updateProject
}
