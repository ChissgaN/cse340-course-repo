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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId }
