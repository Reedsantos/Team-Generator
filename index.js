const cheerio = require("cheerio");
const open = require("open");
const fs = require("fs");
const inquire = require("inquirer");
const employee = require("./assets/js/employee");


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
];