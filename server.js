/* ******************************************
 * CSE 340 Service Network
 * Application entry point (W01)
 * ****************************************** */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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
app.set('views', path.join(__dirname, 'views'));

/* ******************************************
 * Static files (CSS and images) are served
 * from /public, so the browser asks for
 * /css/main.css and /images/<file>.
 * ****************************************** */
app.use(express.static(path.join(__dirname, 'public')));

/* ******************************************
 * Page data
 * ****************************************** */
const organizations = [
  {
    name: 'BrightFuture Builders',
    logo: '/images/brightfuture-logo.svg',
    focus: 'Housing and community construction',
    description:
      'BrightFuture Builders repairs and builds safe homes for families in need. Volunteers help with painting, basic carpentry, and neighborhood clean-up days.'
  },
  {
    name: 'GreenHarvest Growers',
    logo: '/images/greenharvest-logo.svg',
    focus: 'Sustainable food and community gardens',
    description:
      'GreenHarvest Growers runs community gardens and urban farms. Volunteers plant, harvest, and deliver fresh produce to local food banks.'
  },
  {
    name: 'UnityServe Volunteers',
    logo: '/images/unityserve-logo.svg',
    focus: 'General community service',
    description:
      'UnityServe Volunteers coordinates service events across the city, connecting people with the organizations that need help the most each week.'
  }
];

const projects = [
  {
    name: 'Park Cleanup',
    organization: 'GreenHarvest Growers',
    category: 'Environmental',
    description:
      'Volunteers gather on Saturday mornings to remove litter, clear trails, and restore planting beds in neighborhood parks.'
  },
  {
    name: 'Food Drive',
    organization: 'UnityServe Volunteers',
    category: 'Community Service',
    description:
      'A monthly collection of non-perishable food. Volunteers sort, pack, and deliver donations to families served by local food banks.'
  },
  {
    name: 'Community Tutoring',
    organization: 'BrightFuture Builders',
    category: 'Educational',
    description:
      'After-school tutoring in reading and mathematics for elementary and middle school students who need extra support.'
  }
];

const categories = [
  {
    name: 'Environmental',
    description: 'Projects that protect and restore parks, gardens, rivers, and green spaces.'
  },
  {
    name: 'Educational',
    description: 'Tutoring, literacy, and mentoring opportunities for students of every age.'
  },
  {
    name: 'Community Service',
    description: 'Food drives, shelter support, and neighborhood help for families in need.'
  },
  {
    name: 'Health and Wellness',
    description: 'Health fairs, blood drives, and activities that promote physical and mental wellbeing.'
  }
];

/* ******************************************
 * Routes
 * Each route renders an EJS view and passes
 * the page title as an EJS variable.
 * ****************************************** */
app.get('/', (req, res) => {
  res.render('home', { title: 'Home', activePage: 'home' });
});

app.get('/organizations', (req, res) => {
  res.render('organizations', {
    title: 'Organizations',
    activePage: 'organizations',
    organizations
  });
});

app.get('/projects', (req, res) => {
  res.render('projects', {
    title: 'Service Projects',
    activePage: 'projects',
    projects
  });
});

app.get('/categories', (req, res) => {
  res.render('categories', {
    title: 'Categories',
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
app.listen(PORT, () => {
  console.log(`CSE 340 Service Network running in ${NODE_ENV} mode on port ${PORT}`);
});
