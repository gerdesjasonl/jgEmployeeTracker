DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

\c employee_db;

CREATE TABLE departmentTb (
    id SERIAL PRIMARY KEY,
    deptname VARCHAR(30) UNIQUE NOT NULL
    );

CREATE TABLE roleTb (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL, 
    salary DECIMAL(10, 2) NOT NULL, 
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departmentTb(id) ON DELETE SET NULL
    );

CREATE TABLE employeeTb (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roleTb(id) ON DELETE SET NULL, 
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employeeTb(id) ON DELETE SET NULL
    );

-- This is a work space to build joins for use in the index.ts
-- SELECT employeeTb.id, employeeTb.title, employeeTb.salary, employeeTb.department_id, roleTb.title
-- FROM employeeTb
-- LEFT JOIN roleTb ON employeeTb.role_id = roleTb.id;

-- ALTER TABLE employeeTb ALTER COLUMN manager_id DROP NOT NULL; Fixed this issue in line