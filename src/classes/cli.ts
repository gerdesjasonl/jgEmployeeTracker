import inquirer from 'inquirer';
import Employee from './Employee.js';
class Cli {
    employees: [];
    selectedEmployeeId: number | undefined;
    exit: boolean = false;

    constructor(employees: []) {
        this.employees = employees;
    }

// Choose an existing employee
    updateEmp(): void {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'selectEmployee',
                    message: 'Select an employee to update role',
                    choices: this.employees.map((employee) => {
                        return {
                            name: `${employee.role_id} ${role.title } ${employee.id} -- ${employee.last_name}, ${employee.first_name}`
                            value: employee.role_id
                        }
                    })
                }
            ])
            .then ((answers) => {
                this.selectEmployee = answers.selectEmployee;
                this.updateRole();
            })
    };
// Add a new employee
    addEmp(): void {
        const choices = getChoicesFromDb();
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: "firstName",
                    message: "Enter First Name"
                },
                {
                    type: 'input',
                    name: "lastName",
                    message: "Enter Last Name"
                },
                {
                    type: 'list',
                    name: "role",
                    message: "Select Employee Role",
                    choices: choices,
                }
            ])
            .then((answers) => {
                const employee = new Employee (
                    answers.firstName,
                    answers.lastName,
                    answers.role,
                );
            this.employees.push(employee);
            });
        
    }

// This is the main CLI
    startCli(): void {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'selectAction',
              message:
                'What would you like to do?',
              choices: ['View all Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role'],
            },
          ])
          .then((answers) => {
            if (answers.selectAction === 'View All Departments') {
                this.viewDepts();
            } else if (answers.selectAction === 'View All Roles') {
                this.viewRoles();
            } else if (answers.selectAction === 'View All Employees') {
                this.viewEmployees();
            } else if (answers.selectAction === 'Add a Department') {
                this.addDept ();
            } else if (answers.selectAction === 'Add a Role') {
                this.addRole ();
            } else if (answers.selectAction === 'Add an Employee') {
                this.addEmp ();
            } else if (answers.selectAction === 'Update Employee Role') {
                this.updateEmp ();
            }
          });
        }
}