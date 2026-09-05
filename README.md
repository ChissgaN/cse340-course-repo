# CSE 340 - Web Backend Development

Course repository for **CSE 340 (Web Backend Development)** at BYU-Idaho / BYU-Pathway.
It holds all the practical work for the course: exercises, weekly activities, and the
final project built with **Node.js**, **Express**, and **PostgreSQL**.

---

## Course stack

| Tool | Purpose |
|---|---|
| Node.js | JavaScript runtime for the server |
| NPM | Package manager and project scripts |
| Express | Web framework for routes, middleware, and controllers |
| EJS | Template engine for the views |
| PostgreSQL | Relational database |
| pgAdmin 4 | Graphical client for managing the database |
| Git + GitHub | Version control and assignment submission |
| Render | Cloud deployment of the application |

## Versions installed on this machine

- Git: 2.43.0
- Node.js: v24.10.0
- NPM: 11.6.1
- pgAdmin 4: 9.17

## Current structure (W01)

```
cse340-course-repo/
├── public/
│   ├── css/
│   │   └── main.css          # Site stylesheet
│   └── images/               # Static images served at /images/...
├── views/
│   ├── partials/
│   │   ├── header.ejs        # Shared head, branding, and navigation
│   │   └── footer.ejs        # Shared footer
│   ├── home.ejs
│   ├── organizations.ejs
│   ├── projects.ejs
│   ├── categories.ejs
│   └── 404.ejs
├── .env                      # Environment variables (NEVER committed)
├── .env.example              # Template for the .env file
├── .gitignore
├── nodemon.json              # Development auto-restart configuration
├── package.json
└── server.js                 # Application entry point
```

Later weeks will add `controllers/`, `models/`, `routes/`, and `database/` as the course
introduces the MVC pattern and PostgreSQL. Those folders are intentionally not created yet.

## Running the project locally

```bash
# 1. Clone the repository
git clone https://github.com/chissgan/cse340-course-repo.git
cd cse340-course-repo

# 2. Install dependencies
npm install

# 3. Create your local .env file from the template
cp .env.example .env

# 4. Start the development server (Nodemon)
npm run dev

# ...or run it the way production does
npm start
```

The application will be available at `http://localhost:3000`, or whichever port is
defined in `.env`.

## Pages and routes

| Route | View | Page title |
|---|---|---|
| `/` | `views/home.ejs` | Home |
| `/organizations` | `views/organizations.ejs` | Organizations |
| `/projects` | `views/projects.ejs` | Service Projects |
| `/categories` | `views/categories.ejs` | Categories |
| any other route | `views/404.ejs` | Page Not Found (HTTP 404) |

## Notes

- The `.env` file and the `node_modules/` folder are **never** committed.
- Internal Markdown documentation is excluded by `.gitignore`; this README is the only
  Markdown file published.

---

**Student:** _Jairo Noodli Castro Castillo_
**Course:** CSE 340 - Web Backend Development