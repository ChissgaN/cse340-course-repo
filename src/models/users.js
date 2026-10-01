import bcrypt from 'bcrypt';
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

/**
 * Finds one user by email, including the password hash.
 * Not exported: only authenticateUser below needs the hash.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id
      FROM public.users
      WHERE email = $1;
    `;

    const queryParams = [email];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

/**
 * Checks a plain password against a stored hash.
 * Not exported: only authenticateUser below uses it.
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Verifies an email and password together.
 *
 * Returns the user without the password hash, or null if either the email is
 * unknown or the password is wrong. The caller cannot tell those two cases
 * apart, which is deliberate: revealing that an email exists would let an
 * attacker discover who has an account.
 *
 * @returns {object|null} The user, minus password_hash, or null.
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (user === null) {
        return null;
    }

    const passwordMatches = await verifyPassword(password, user.password_hash);

    if (!passwordMatches) {
        return null;
    }

    // The hash must never leave the model, and certainly never reach the
    // session, where it would be serialised into the session store.
    const { password_hash, ...userWithoutHash } = user;

    return userWithoutHash;
};

// Export the model functions
export { createUser, authenticateUser }
