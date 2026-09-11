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
