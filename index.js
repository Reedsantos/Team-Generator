const cheerio = require("cheerio");
const open = require("open");
const fs = require("fs");
const inquire = require("inquirer");
const employee = require("./js/employee");


let empID = 0;

let employees = [];

const loopQuestion = [
    {
        name: "empAdd",
        message: "Add another Employee?",
        type: "confirm",
        default: true
    }
]

const questionList = [
    {
        name: "empRole",
        message: "Enter your job role",
        type: "list",
        choices: ["Manager", "Engineer", "Employee", "Intern"]
    },
    {
        name: "empName",
        message: "Enter your name",
        type: "input",
    },
    {
        name: "empEmail",
        message: "Enter your Email",
        type: "input",
        validate: function (empEmail) {

            valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(empEmail)

            if (valid) {
                return true;
            } else {
                console.log("Please enter a valid email")
                return false;
            }
        }
    },
    {
        name: "empSchool",
        message: "Enter your School",
        type: "input",
        when: function (answers) {
            return answers.empRole === "Intern"
        }
    },
    {
        name: "empOffice",
        message: "Enter your Office number",
        type: "input",
        when: function (answers) {
            return answers.empRole === "Manager"
        }
    },
    {
        name: "empGitHub",
        message: "Enter your GitHub username",
        type: "input",
        when: function (answers) {
            return answers.empRole === "Engineer"
        }
    },
]
function collectEmployee(retFunction) {


    inquire
        .prompt(questionList)
        .then(function (response) {

            empID += 1;

            let emp;

            if (response.empRole === "Manager") {
                emp = new manager(response.empName, empID, response.empEmail, response.empOffice);
            } else if (response.empRole === "Engineer") {
                emp = new engineer(response.empName, empID, response.empEmail, response.empGitHub);
            } else if (response.empRole === "Employee") {
                emp = new employee(response.empName, empID, response.empEmail);
            } else if (response.empRole === "Intern") {
                emp = new intern(response.empName, empID, response.empEmail, response.empSchool);
            }

            employees.push(emp);

            retFunction();
        });
}

function addEmployee() {
    inquire
        .prompt(loopQuestion)
        .then(function (response) {
            if (response.empAdd)
                collectEmployee(addEmployee);
            else
                newFunction();
        });
};