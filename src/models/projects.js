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

// Export the model functions
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByCategoryId
}
