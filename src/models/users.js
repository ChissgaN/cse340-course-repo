import db from './db.js'

/**
 * Creates a new user account with the standard 'user' role.
 *
 * The role is looked up by name rather than hardcoded as an id, so the
 * function keeps working if the roles table is rebuilt in a different order.
 *
 * @param {string} name - The user's display name.
 * @param {string} email - The user's email, which doubles as the username.
 * @param {string} passwordHash - The bcrypt hash. Never the password itself.
 * @returns {number} The id of the newly created user record.
 */
const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO public.users (name, email, password_hash, role_id)
      VALUES ($1, $2, $3, (SELECT role_id FROM public.roles WHERE role_name = 'user'))
      RETURNING user_id;
    `;

    const queryParams = [name, email, passwordHash];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0].user_id;
};

// Export the model functions
export { createUser }
