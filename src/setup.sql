-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.svg'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.svg'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.svg'
);


-- ========================================
-- Verify Organizations
-- ========================================

SELECT * FROM organization;

-- ========================================
-- Service Project Table
-- ========================================
--
-- Cada proyecto pertenece a UNA organizacion que lo patrocina.
-- La relacion es uno-a-muchos: una organizacion tiene muchos
-- proyectos, un proyecto tiene una sola organizacion.

CREATE TABLE project (
    project_id      SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL
                    REFERENCES organization(organization_id)
                    ON DELETE CASCADE,
    title           VARCHAR(150) NOT NULL,
    description     TEXT NOT NULL,
    location        VARCHAR(255) NOT NULL,
    project_date    DATE NOT NULL
);


-- ========================================
-- Insert sample data: Service Projects
-- ========================================
-- 5 proyectos por cada una de las 3 organizaciones = 15 en total.

INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
-- BrightFuture Builders (organization_id = 1)
(1, 'Wheelchair Ramp Build',
    'Volunteers build a wooden access ramp for a family whose home has no step-free entrance.',
    '412 Maple Street, Rexburg', '2026-10-03'),
(1, 'Winter Weatherization Day',
    'Seal windows, add insulation and replace worn weather stripping in homes of elderly residents before winter.',
    'Pioneer Heights Neighborhood', '2026-10-17'),
(1, 'Community Center Repainting',
    'Repaint the interior walls and trim of the neighborhood community center.',
    'Riverside Community Center', '2026-11-07'),
(1, 'Playground Repair Project',
    'Replace broken boards, sand rough edges and repaint the equipment at a public playground.',
    'Hillcrest Park', '2026-11-21'),
(1, 'Porch and Railing Repairs',
    'Rebuild unsafe porch steps and install sturdy handrails for residents with limited mobility.',
    'South Bridge Housing Area', '2026-12-05'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Fall Community Garden Harvest',
    'Pick the last of the season produce and deliver it to the regional food bank the same afternoon.',
    'Eastside Community Garden', '2026-10-10'),
(2, 'Compost Building Workshop',
    'Build compost bins from reclaimed pallets and teach neighbors how to maintain them.',
    'Greenfield Urban Farm', '2026-10-24'),
(2, 'School Garden Planting',
    'Prepare raised beds and plant cold-weather crops with students at a local elementary school.',
    'Lincoln Elementary School', '2026-11-14'),
(2, 'Riverbank Tree Planting',
    'Plant native saplings along the riverbank to reduce erosion and restore shade.',
    'Snake River Greenway', '2026-11-28'),
(2, 'Greenhouse Winter Setup',
    'Repair greenhouse panels and set up irrigation so winter growing can continue.',
    'Greenfield Urban Farm', '2026-12-12'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'Neighborhood Food Drive',
    'Collect, sort and pack non-perishable food donations for families served by local pantries.',
    'Main Street Civic Hall', '2026-10-04'),
(3, 'Park Cleanup Morning',
    'Remove litter, clear walking trails and restore planting beds across the park.',
    'Porter Park', '2026-10-18'),
(3, 'After-School Tutoring Launch',
    'Volunteers tutor elementary and middle school students in reading and mathematics.',
    'Rexburg Public Library', '2026-11-08'),
(3, 'Winter Coat Collection',
    'Gather, clean and distribute winter coats, gloves and boots to families in need.',
    'Unity Service Center', '2026-11-22'),
(3, 'Senior Center Holiday Visit',
    'Spend an afternoon with residents: games, music and handwritten cards.',
    'Valley View Senior Center', '2026-12-19');


-- ========================================
-- Verify Service Projects
-- ========================================

SELECT p.project_id, p.project_date, p.title, o.name AS organization_name
FROM project p
JOIN organization o ON o.organization_id = p.organization_id
ORDER BY p.project_date;


-- ========================================
-- Category Table
-- ========================================
--
-- Un proyecto puede pertenecer a varias categorias y una categoria
-- puede tener varios proyectos: es una relacion muchos-a-muchos.
-- En SQL eso no se puede guardar en una sola columna, asi que se
-- necesita una tabla intermedia (project_category) mas abajo.

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE
);


-- ========================================
-- Insert sample data: Categories
-- ========================================

INSERT INTO category (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');


-- ========================================
-- Project / Category junction table
-- ========================================
--
-- Cada fila une UN proyecto con UNA categoria. Si un proyecto tiene
-- dos categorias, aparece en dos filas.
--
-- La clave primaria compuesta (project_id, category_id) impide que
-- se repita el mismo par, que es la forma de evitar duplicados.

CREATE TABLE project_category (
    project_id  INTEGER NOT NULL
                REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL
                REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);


-- ========================================
-- Insert sample data: Project categories
-- ========================================
-- Categorias: 1 Environmental | 2 Educational
--             3 Community Service | 4 Health and Wellness
-- Todos los proyectos tienen al menos una categoria.

INSERT INTO project_category (project_id, category_id)
VALUES
(1, 3),            -- Wheelchair Ramp Build
(2, 3),            -- Winter Weatherization Day
(3, 3),            -- Community Center Repainting
(4, 3), (4, 4),    -- Playground Repair Project
(5, 3),            -- Porch and Railing Repairs
(6, 1), (6, 3),    -- Fall Community Garden Harvest
(7, 1), (7, 2),    -- Compost Building Workshop
(8, 2), (8, 1),    -- School Garden Planting
(9, 1),            -- Riverbank Tree Planting
(10, 1),           -- Greenhouse Winter Setup
(11, 3),           -- Neighborhood Food Drive
(12, 1),           -- Park Cleanup Morning
(13, 2),           -- After-School Tutoring Launch
(14, 3),           -- Winter Coat Collection
(15, 4), (15, 3);  -- Senior Center Holiday Visit


-- ========================================
-- Verify Categories
-- ========================================

SELECT c.category_id, c.name, COUNT(pc.project_id)::int AS total_projects
FROM category c
LEFT JOIN project_category pc ON pc.category_id = c.category_id
GROUP BY c.category_id, c.name
ORDER BY c.name;
