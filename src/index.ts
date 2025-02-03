import inquirer from 'inquirer';
import pg from 'pg';
const { Pool } = pg;

// The Dotenv would not work for me here, so I entered , manually
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
    const res = await pool.query('SELECT roleTb.id, roleTb.title, roleTb.salary, roleTb.department_id, departmentTb.deptname FROM roleTb LEFT JOIN departmentTb ON roleTb.department_id = departmentTb.id');
    console.table(res.rows);
  } catch (err) {
    console.error('Error executing query', err);
  }
}

// This is for the view all employees action
async function viewEmployees() {
  try {
    const res = await pool.query('SELECT employeeTb.id, employeeTb.first_name, employeeTb.last_name, employeeTb.role_id, roleTb.title FROM employeeTb LEFT JOIN roleTb ON employeeTb.role_id = roleTb.id');
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
    const roleChoices = roles.rows.map(role => ({name: role.title, value: role.id}));
  // I was not sure if declaring these variables universaly would harm the overall code, I declared them in two different functions.  
    const empl = await pool.query('SELECT id, first_name, last_name FROM employeeTb');
    const emplChoices = empl.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
      }));

    const newEmployee = await inquirer.prompt([
    {
        type: 'input',
        name: 'firstName',
        message: 'Enter first name:',
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'Enter last name:',
    },
    {
        type: 'list',
        name: 'role_id',
        message: 'Select Employee Role',
        choices: roleChoices
    },
    {
        type: 'list',
        name: 'manager',
        message: 'Select the Manager for this employee',
        choices: [{name: 'None', value: null }, ...emplChoices] 
    }
  ]);
    await pool.query('INSERT INTO employeeTb (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [newEmployee.firstName, newEmployee.lastName, newEmployee.role_id, newEmployee.manager || null]
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
    const depts = await pool.query('SELECT id, deptname FROM departmentTb');
    const deptChoices = depts.rows.map(dept => ({
        name: String(dept.deptname),
        value: dept.id
      }));

    const {role_title, salary, department_id} = await inquirer.prompt([
    {
      type: 'input',
      name: 'role_title',
      message: 'Enter New Role Title'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter Salary for New Role'
    },
  // This list will populate from the department table
    {
      type: 'list',
      name: 'department_id',
      message: 'Select Department for new Role',
      choices: deptChoices
    },
  ]);
  await pool.query('INSERT INTO roleTb (title, salary, department_id) VALUES ($1, $2, $3)',
  [role_title, salary, department_id]
  );
    console.log('Role added successfully.')
  } catch (err) {
    console.error('Error adding role', err);
  }
}

// This is for the Update Employee Role action
async function updateEmployee() {
  try {
    // This is getting employees to choose from
      const empl= await pool.query('SELECT id, first_name, last_name FROM employeeTb');
      const emplChoices = empl.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
      }));

    // This is getting roles to choose from
      const roles = await pool.query('SELECT id, title FROM roleTb');
      const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id
      }));

    // This is the Inquirer prompt for updating roles
      const {employee_id, role_id} = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select Employee to Update Role',
      choices: emplChoices
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select New Role to Update',
      choices: roleChoices
    }
    ]);
  // Update the employee role in the database
    await pool.query('UPDATE employeeTb SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Role updated successfully.');
  } catch (err) {
    console.log('Error updating employee role.', err)
  }
}

// Start the CLI
mainMenu();