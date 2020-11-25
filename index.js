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
                writeHTMLFile();
        });
};

function writeHTMLFile() {
    let profileHTML = fs.readFileSync("./template.html", "utf8", function (err) {
        if (err)
            console.log(err);
    });

    const $ = cheerio.load(profileHTML);

    employees.forEach(emp => {
        let empRole = emp.get_role();
        let output;

        if (empRole === "Manager") {
            output = generateManagerCard(emp.name, emp.id, emp.email, emp.office_number);
        } else if (empRole === "Intern") {
            output = generateInternCard(emp.name, emp.id, emp.email, emp.school);
        } else if (empRole === "Employee") {
            output = generateEmployeeCard(emp.name, emp.id, emp.email);
        } else if (empRole === "Engineer") {
            output = generateEngineerCard(emp.name, emp.id, emp.email, emp.github)
        }

        $("#TeamCards").append(output);
    });

    fs.writeFile("./team_output.html", $.html(), function (err) {
        if (err)
            console.log(err);

        openTeamFile("./team_output.html")
    });
}

async function openTeamFile(fileName) {

    await open(fileName, { wait: true });
    console.log("Opening file");
};