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

## Planned structure

```
cse340-course-repo/
├── controllers/     # Logic that responds to each route
├── database/        # PostgreSQL connection and queries
├── models/          # Data access layer
├── public/          # CSS, images, and client-side JS
├── routes/          # Express route definitions
├── views/           # EJS templates
├── .env             # Environment variables (NEVER committed)
├── .gitignore
├── package.json
└── server.js        # Application entry point
```

## Running the project locally

```bash
# 1. Clone the repository
git clone https://github.com/chissgan/cse340-course-repo.git
cd cse340-course-repo

# 2. Install dependencies
npm install

# 3. Create a .env file with your local credentials
#    (see .env.example once it exists)

# 4. Start the development server
npm run dev
```

The application will be available at `http://localhost:5500`, or whichever port is
defined in `.env`.

## Notes

- The `.env` file and the `node_modules/` folder are **never** committed.
- Internal Markdown documentation is excluded by `.gitignore`; this README is the only
  Markdown file published.

---

**Student:** _Jairo Noodli Castro Castillo_
**Course:** CSE 340 - Web Backend Development