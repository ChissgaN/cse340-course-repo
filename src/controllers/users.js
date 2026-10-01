// Import any needed model functions
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { createUser } from '../models/users.js';

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
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
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

// Export any controller functions
export { registrationValidation, showUserRegistrationForm, processUserRegistrationForm };
