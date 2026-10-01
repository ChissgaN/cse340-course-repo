// Import any needed model functions
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

/**
 * How many times bcrypt runs its hashing algorithm. Higher is slower to
 * compute, which is the point: it slows an attacker down far more than it
 * slows a single login.
 */
const SALT_ROUNDS = 10;

// PostgreSQL error code for a unique constraint violation.
const UNIQUE_VIOLATION = '23505';

/**
 * Server-side validation rules for a registration.
 *
 * The password is deliberately not trimmed: leading and trailing spaces are
 * legitimate characters in a password and removing them would silently change
 * what the user typed.
 */
const registrationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Email must be a valid email address.')
        .isLength({ max: 100 }).withMessage('Email must be less than 100 characters.'),
    body('password')
        .notEmpty().withMessage('Password is required.')
        // Six, not the eight you would normally want: the course requires a
        // grading account whose password is 'cse340!', which is seven
        // characters, and it has to be registered through this form so the
        // password is hashed the same way as everyone else's.
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
];

// Define any controller functions
const showUserRegistrationForm = async (req, res) => {
    const title = 'Register';

    res.render('register', { title, activePage: 'register' });
};

const processUserRegistrationForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/register');
    }

    const { name, email, password } = req.body ?? {};

    // Hash before the password goes anywhere else. The plain value is never
    // stored, never logged, and never leaves this function.
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
        await createUser(name, email, passwordHash);
    } catch (error) {
        // email is UNIQUE, so a repeated address is a user mistake rather than
        // a server fault. Anything else is genuinely unexpected.
        if (error.code === UNIQUE_VIOLATION) {
            req.flash('error', 'An account with that email already exists.');
            return res.redirect('/register');
        }
        throw error;
    }

    req.flash('success', 'Account created successfully! You can now sign in.');

    res.redirect('/');
};

const showLoginForm = async (req, res) => {
    const title = 'Sign In';

    res.render('login', { title, activePage: 'login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body ?? {};

    const user = await authenticateUser(email, password);

    if (user === null) {
        // One message for both causes. Saying "no such email" would confirm
        // which addresses have accounts.
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
    }

    req.session.user = user;

    if (process.env.NODE_ENV?.toLowerCase() === 'development') {
        console.log('User logged in:', user);
    }

    req.flash('success', `Welcome back, ${user.name}!`);

    res.redirect('/dashboard');
};

/**
 * Blocks a request when nobody is signed in.
 *
 * This is the enforcement the hidden navigation links do not provide: a link
 * that is not rendered can still be typed into the address bar, so the check
 * has to happen on the server.
 */
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'Please sign in to view that page.');
        return res.redirect('/login');
    }

    next();
};

/**
 * Builds middleware that blocks anyone who does not hold the given role.
 *
 * This is a factory: it takes the role and returns the middleware. A plain
 * middleware function can only receive (req, res, next), so there would be
 * nowhere to say which role a route needs - the outer call is what captures it.
 *
 * @param {string} role - The role the route requires.
 * @param {string} redirectTo - Where to send someone who lacks it. Pages
 *   reached from the dashboard send them back there; the rest go home.
 */
const requireRole = (role, redirectTo = '/') => {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role_name === role) {
            return next();
        }

        req.flash('error', 'You do not have permission to view that page.');
        res.redirect(redirectTo);
    };
};

const showDashboard = async (req, res) => {
    const { name, email } = req.session.user;
    const title = 'Dashboard';

    res.render('dashboard', { title, activePage: 'dashboard', name, email });
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    const title = 'Registered Users';

    res.render('users', { title, activePage: 'dashboard', users });
};

const processLogout = async (req, res) => {
    // The message has to be written to the NEW session: destroying the old one
    // takes its flash storage with it, so a message stored beforehand would
    // never be read.
    req.session.regenerate((err) => {
        if (err) {
            return res.redirect('/login');
        }

        req.flash('success', 'You have been logged out.');
        res.redirect('/login');
    });
};

// Export any controller functions
export {
    registrationValidation,
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};
