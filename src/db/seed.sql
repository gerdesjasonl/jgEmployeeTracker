INSERT INTO departmentTb (deptName)
VALUES
    ('Marketing'),
    ('Quality Assurance (QA)'),
    ('Design Department');

SELECT * FROM departmentTb;

INSERT INTO roleTb (title, salary, department_id)
VALUES
    ('Technical Lead (Manager)', 140000),
    ('Software Engineer', 130000),
    ('Junior Software Engineer', 83000);

SELECT * FROM roleTb;

INSERT INTO employeeTb (first_name, last_name, role_id, manager_id)
VALUES
    ('Randi', 'Hardley', '', 01 ),
    ('Brian', 'Brody', '', 01),
    ('Emmit', 'Freund', '', 01);

SELECT * FROM employeeTb;
