DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

\c employee_db;

CREATE TABLE departmentTb (
    id SERIAL PRIMARY KEY,
    deptName VARCHAR(30) UNIQUE NOT NULL
    ); 

CREATE TABLE roleTb (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL, 
    salary DECIMAL NOT NULL, 
    department_id INTEGER NOT NULL REFERENCES department(id)
    ); 

CREATE TABLE employeeTb (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES role(id), 
    manager_id INTEGER
    );