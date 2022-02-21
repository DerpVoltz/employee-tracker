const inquirer = require('inquirer');
const { forEach } = require('lodash');
const { basename } = require('path/posix');
const db = require('./db/connection');

const startQuestions = [
    {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    }
]

const depQuestion = [
    {
        type: 'input',
        name: 'depName',
        message: 'What is the name of the department?',
        validate: depNameInput => {
            if (depNameInput) {
                return true;
            }
            console.log('Please enter department name.');
            return true;
        }
    }
]

const roleQuestions = [
    {
        type: 'input',
        name: 'roleName',
        message: 'What is the roles title?',
        validate: roleNameInput => {
            if (roleNameInput) {
                return true;
            }
            console.log('Please enter role title.');
            return false;
        }
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of this role?',
        validate: salaryInput => {
            if (salaryInput) {
                return true;
            }
            console.log('Please enter the salary.');
            return false;
        }
    },
    {
        type: 'list',
        name: 'department',
        message: 'Which department does it belong to?',
        choices: departmentNames()
    }
]

const employeeQuestions = [
    {
        type: 'input',
        name: 'firstName',
        message: 'What is their first name?',
        validate: firstNameInput => {
            if (firstNameInput) {
                return true;
            }
            console.log('Please enter first name.');
            return false;
        }
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'What is their last name?',
        validate: lastNameInput => {
            if (lastNameInput) {
                return true;
            }
            console.log('Please enter last name.');
            return false;
        }
    },
    {
        type: 'list',
        name: 'employeeRole',
        message: 'What is their role?',
        choices: roleNames()
    },
    {
        type: 'list',
        name: 'manager',
        message: 'Who is their manager?',
        choices: employeeNames()
    }
]

const updateQuestions = [
    {
        type: 'list',
        name: 'employeeName',
        message: 'Who do you want to update?',
        choices: employeeNames()
    },
    {
        type: 'list',
        name: 'roleName',
        message: 'What will be their new role?',
        choices: roleNames()
    }
]

function responseHandler(data) {
    if (data.choice === 'View All Employees') {
        const sql = `SELECT first_name, last_name, role.title as role
        FROM employee n
        LEFT JOIN role ON n.role_id = role.id;
        `
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
            }
            console.log('');
            console.table(rows);
        })
        start();
    }
    if (data.choice === 'Add Employee') {
        start();
        // inquirer.prompt(employeeQuestions).then(data => {
        //     const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
        //     VALUES(?, ?, ?, ?)`;
        //     const sqlTwo = `SELECT * FROM role`;
        //     const sqlThree = `SELECT * FROM employee`;

        //     db.query(sqlTwo, (err, rows) => {
        //         for (let i; i < rows.length; i++) {
        //             if (err) {
        //                 console.log(err)
        //             }
        //             if (rows[i].title === data.employeeRole) {
        //                 const role = rows[i].id;
        //                 db.query(sqlThree, (err, result) => {
        //                     if (err) {
        //                         console.log(err);
        //                     }
        //                     for (let i = 0; i < result.length; i++) {
        //                         const name = result[i].first_name + ' ' + result[i].last_name;
        //                         if (name === data.manager) {
        //                             const manager = result[i].id;
        //                             const params = [data.firstName, data.lastName, role, manager];
        //                             db.query(sql, params, (err, row) => {
        //                                 if (err) {
        //                                     console.log(err);
        //                                 }
        //                                 console.log('');
        //                                 console.table(row)
        //                             })
        //                         }
        //                     }
        //                 }) 
        //             }
        //         }
        //     })
        // })
    }
    if (data.choice === 'Update Employee Role') {
        start();
        // inquirer.prompt(updateQuestions).then(data => {
        //     const sql = `UPDATE employee SET role_id=? WHERE id=?`;
        //     const sqlTwo = `SELECT * FROM employee`;
        //     const sqlThree = `SELECT * FROM role`;
        //     db.query(sqlTwo, (err, rows) => {
        //         if (err) {
        //             console.log(err)
        //         }
        //         for (let i = 0; i < rows.length; i++) {
        //             const name = rows[i].firstname + ' ' + rows[i].last_name;
        //             if (data.employeeName === name) {
        //                 const employeeId = rows[i].id;
        //                 db.query(sqlThree, (err, result) => {
        //                     if (err) {
        //                         console.log(err);
        //                     }
        //                     for (let i = 0; i < result.length; i++){
        //                         if(err) {
        //                             console.log(err);
        //                         }
        //                         if (data.roleName === result[i].title) {
        //                             const role = result[i].id;
        //                             const params = [employeeId, role];
        //                             db.query(sql, params, (err, row) => {
        //                                 if (err) {
        //                                     console.log(err);
        //                                 }
        //                                 console.log('Updated Role');
        //                                 console.table(row);
        //                             })
        //                         }
        //                     }
        //                 })
        //             }
        //         }
        //     })
        // })
    }
    if (data.choice === 'View All Roles') {
        const sql = `SELECT title, department.name AS department, salary 
        FROM role
        LEFT JOIN department
        ON role.department_id = department.id;`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
            }
            console.log('');
            console.table(rows);
        })
        start();
    }
    if (data.choice === 'Add Role') {
        inquirer.prompt(roleQuestions).then(data => {
            const sql = `INSERT INTO role(title, department_id, salary)
            VALUES(?, ?, ?)`;
            const sqlTwo = `SELECT * FROM department`;
            db.query(sqlTwo, (err, rows) => {
                console.log(rows);
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].name === data.department) {
                        const department = rows[i].id;
                        const params = [data.roleName, department, data.salary];
                        db.query(sql, params, (err, row) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log('');
                            console.table(row);
                            start();
                        });
                    }
                }
            });
        });
    }
    if (data.choice === 'View All Departments') {
        const sql = 'SELECT name FROM department';
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
            }
            console.log('');
            console.table(rows); 
        });
        start();
    }
    if (data.choice === 'Add Department') {
        inquirer.prompt(depQuestion).then(data => {
            const name = data.depName;
            const sql = `INSERT INTO department(name)
            VALUES(?)`;

            const params = [name]

            db.query(sql, params, (err, row) => {
                if (err) {
                    console.log(err);
                }
                console.log('');
                console.table(row);
                start();
            });
        });
    }
    if (data.choice === 'Quit') {
        console.log('GoodBye');
        process.exit(0);
    }
}

function departmentNames() {
    const sql = `SELECT * FROM department`;
    const names = [];

    db.query(sql, (err, rows) => {
        for (let i = 0; i < rows.length; i++) {
            const name = rows[i].name;
            names.push(name);
        }
    });
    return names;
}

function roleNames() {
    const sql = `SELECT * FROM role`;
    const names = [];

    db.query(sql, (err, rows) => {
        for (let i = 0; i < rows.length; i++) {
            const name = rows[i].title;
            names.push(name);
        }
    });
    return names;
}

function employeeNames() {
    const sql = `SELECT * FROM employee`;
    const names = [];

    db.query(sql, (err, rows) => {
        for (let i = 0; i < rows.length; i++) {
            const firstName = rows[i].first_name;
            const lastName = rows[i].last_name;
            const name = firstName + ' ' + lastName;
            names.push(name);
        }
    });
    return names;
}

function start() {
    inquirer.prompt(startQuestions).then(data => {
        responseHandler(data);
    });
}

start();