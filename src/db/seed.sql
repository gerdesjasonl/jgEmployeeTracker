INSERT INTO departmentTb (deptName)
VALUES
    ('Marketing'),
    ('Quality Assurance (QA)'),
    ('Design Department');

SELECT * FROM departmentTb;

INSERT INTO roleTb (title, salary)
VALUES
    ('Technical Lead (Manager)', 140000),
    ('Software Engineer', 130000),
    ('Junior Software Engineer', 83000);

SELECT * FROM roleTb;

INSERT INTO employeeTb (first_name, last_name)
VALUES
    ('Randi', 'Hardley'),
    ('Brian', 'Brody'),
    ('Emmit', 'Freund');

SELECT * FROM employeeTb;
