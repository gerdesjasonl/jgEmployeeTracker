import inquirer from 'inquirer';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_db',
    password: 'postgres1!',
    port: 5432,
  });

// This is the Main Menu for the CLI
async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit']
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
};

// This is for the view all departments action
async function viewDepts() {
  try {
    const res = await pool.query('SELECT * FROM departmentTb');
    console.table(res.rows);
  } catch (err) {
    console.error('Error executing query', err);
  }
}

// This is for the view all roles action
async function viewRoles() {
  try {
    const res = await pool.query('SELECT * FROM roleTb');
    console.table(res.rows);
  } catch (err) {
    console.error('Error executing query', err);
  }
}

// This is for the view all employees action
async function viewEmployees() {
  try {
    const res = await pool.query('SELECT * FROM employeeTb');
    console.table(res.rows);
  } catch (err) {
    console.error('Error executing query', err);
  }
}

// // This function lists available role titles when creating a new employee
// // I chose to comment this out in favor of try block below. This allows for selection of roles based on title but is added to database using corresponding id.
// async function getChoicesFromDb() {
//   try {
//     const res = await pool.query('SELECT id, title FROM roleTb');
//     return res.rows.map(row => row.title);
//   } catch (err) {
//     console.error('Error fetching data:', err);
//     return [];
//   }
// }

// This is for the Add Employee action
async function addEmployee() {
  try {
    const roles = await pool.query('SELECT id, title FROM roleTb');
    const choices = roles.rows.map(role => ({name: role.title, value: role.id}));
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
    await pool.query('INSERT INTO employeeTb (first_name, last_name, role_id) VALUES ($1, $2, $3)',
      [newEmployee.firstName, newEmployee.lastName, newEmployee.role_id]
    );
    console.log('Employee added successfully.');
  } catch (err) {
    console.error('Error adding employee', err);
  }
}

// This is for the Add Department action
async function addDept() {
  const newDept = await inquirer.prompt([
    {
      type: 'input',
      name: 'dept_name',
      message: 'Enter New Department Name'
    }
  ]);
  await pool.query('INSERT INTO departmentTb (deptName) VALUES ($1)',
  [newDept.dept_name]
  );
  console.log('Department added successfully.')
}

// This is for the Add Role action
async function addRole() {
  try {
    const newRole = await inquirer.prompt([
    {
      type: 'input',
      name: 'role_title',
      message: 'Enter New Role Title'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter Salary for New Role'
    }
  ]);
  await pool.query('INSERT INTO roleTb (title, salary) VALUES ($1, $2)',
  [newRole.role_title, newRole.salary]
  );
    console.log('Role added successfully.')
  } catch (err) {
    console.error('Error adding role', err);
  }
}

// This is for the Update Employee Role action
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