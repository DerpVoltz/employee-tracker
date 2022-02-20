const inquirer = require('inquirer');
const db = require('./db/connection');

const startQuestions = [
    {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    }
]

function responseHandler(data) {
    if (data.choice === 'View All Employees') {
        console.log('Employees');
        start();
    }
    if (data.choice === 'Add Employee') {
        console.log('Add Employees');
        start();
    }
    if (data.choice === 'Update Employee Role') {
        console.log('Employee Role');
        start();
    }
    if (data.choice === 'View All Roles') {
        const sql = `SELECT title, department.name AS department, salary 
        FROM role
        RIGHT JOIN department
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
        console.log('Add Role');
        start();
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
        console.log('add dep');
        start();
    }
    if (data.choice === 'Quit') {
        console.log('GoodBye');
        process.exit(0);
    }
}

function start() {
    inquirer.prompt(startQuestions).then(data => {
        responseHandler(data);
    });
}

start();