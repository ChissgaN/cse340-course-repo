/* ******************************************
 * CSE 340 Service Network
 * Application entry point (W01)
 * ****************************************** */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

/* ******************************************
 * ESM does not provide __filename / __dirname,
 * so we build them from the module URL.
 * ****************************************** */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ******************************************
 * Environment variables
 * ****************************************** */
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const app = express();

/* ******************************************
 * View engine: EJS
 * ****************************************** */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

/* ******************************************
 * Static files (CSS and images) are served
 * from /public, so the browser asks for
 * /css/main.css and /images/<file>.
 * ****************************************** */
app.use(express.static(path.join(__dirname, 'public')));


/* ******************************************
 * Routes
 * Each route renders an EJS view and passes
 * the page title as an EJS variable.
 * ****************************************** */
app.get('/', (req, res) => {
  res.render('home', { title: 'Home', activePage: 'home' });
});

app.get('/organizations', async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Our Partner Organizations';

  res.render('organizations', {
    title,
    activePage: 'organizations',
    organizations
  });
});

app.get('/projects', async (req, res) => {
  const projects = await getAllProjects();
  const title = 'Service Projects';

  res.render('projects', {
    title,
    activePage: 'projects',
    projects
  });
});

app.get('/categories', async (req, res) => {
  const categories = await getAllCategories();
  const title = 'Categories';

  res.render('categories', {
    title,
    activePage: 'categories',
    categories
  });
});

/* ******************************************
 * 404 - any route that did not match above
 * ****************************************** */
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found', activePage: '' });
});

/* ******************************************
 * Start the server
 * ****************************************** */
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
