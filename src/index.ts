import inquirer from 'inquirer';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
  });

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add and Employee', 'Exit']
    }
  ]);

  switch (action) {
    case 'View All Departments':
        await viewDepts();
        break;
    case 'View All Roles':
        await viewRoles();
        break;
    case 'View All Employees':
        await viewEmployees();
        break;
    case 'Add a Department':
        await addDept();
        break;
    case 'Add a Role':
        await addRole();
        break;
    case 'Add an Employee':
        await addEmployee();
        break;
    case 'Update an Employee Role':
        await updateEmployee();
        break;
    case 'Exit':
        console.log("Exiting...");
        pool.end();
        return;
  }
  mainMenu();
}

async function viewDepts() {
  const res = await pool.query('SELECT * FROM departmentTb');
  console.table(res.rows);
}

async function viewRoles() {
    const res = await pool.query('SELECT * FROM roleTb');
    console.table(res.rows);
}

async function viewEmployees() {
    const res = await pool.query('SELECT * FROM employeeTb');
    console.table(res.rows);
}

async function getChoicesFromDb() {
  try {
    await pool.connect();
    const res = await pool.query('SELECT title FROM roleTb');
    return res.rows.map(row => row.name);
  } catch (err) {
    console.error('Error fetching data:', err);
    return [];
  }
}

async function addEmployee() {
  const choices = await getChoicesFromDb();
  const newEmployee = await inquirer.prompt([
    {
        type: 'input',
        name: 'firstName',
        message: 'Enter first name:',
    },
    {
        type: 'input',
        name: "lastName",
        message: "Enter last name:",
    },
    {
        type: 'list',
        name: "role_id",
        message: "Select Employee Role",
        choices: choices
    } 
  ]);

  await pool.query('INSERT INTO employeeTb (first_name, last_name, role_id) VALUES (?, ?, ?)',
    [newEmployee.firstName, newEmployee.lastName, newEmployee.role_id]
  );
  console.log("Employee added successfully.");
}

async function addDept() {

}

async function addRole() {

}

async function updateEmployee() {
  const res = await pool.query('SELECT role FROM employeeTb');
  const { role } = await inquirer.prompt([
    {
      type: 'list',
      name: 'role',
      message: 'Update employee role:',
      choices: res.rows.map(row => ({ name: row.name, value: row.role }))
    }
  ]);

  await pool.query('UPDATE employeeTb SET role_id', [role]);
  console.log("Role updated successfully.");
}


// Start the CLI
mainMenu();