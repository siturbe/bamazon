const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'
});

connection.connect(function(err){
    if (err) throw err;
    startSupervisor();
});


function startSupervisor(){
    inquirer
        .prompt({
            name: 'option',
            type: 'rawlist',
            message: 'MENU:  ',
            choices: ['View Product Sales by Department', 'Create New Department', 'Exit']
        })
        .then(function(answer){
            let path = answer.option;
            switch (path){
                case "View Product Sales by Department":
                    return viewProductSales();
                case 'Create New Department':
                    return createDepartment();
                case 'Exit':
                    return exitOption();
            }
        })
}


function viewProductSales(){
    console.log("Function ran");
    let query = "SELECT departments.department_id, departments.department_name, departments.overhead_costs, SUM(products.product_sales) AS totalSales, SUM(products.product_cogs) AS totalCOGS FROM products JOIN departments ON products.department_name = departments.department_name GROUP BY department_name";
    connection.query(query, function (err, results){
        if (err) throw err;
        let table = new Table({
            head: [ "Dep ID", "Dep. Name", "Sales $", "COGS $", "Overhead $", "Ops. Profit $", "Tax Provision $", "Net Income $" ],
            colWidths: [10, 20, 15, 15, 10, 20, 20, 15]
        });
        console.log("-----------------------------------------");
        for(let i=0; i<results.length; i++){
            let department_profit = results[i].totalSales - results[i].totalCOGS - results[i].overhead_costs;
            let tax_provision = .2*department_profit;
            let net_income = department_profit - tax_provision;
            table.push([results[i].department_id, results[i].department_name, results[i].totalSales, results[i].totalCOGS, results[i].overhead_costs, department_profit, tax_provision, net_income]);
        }
        console.log(table.toString());
        console.log("-----------------------------------------");
        exitOption();
    })
}


function createDepartment(){
    inquirer
    .prompt([
        {
            name: 'department_name',
            type: 'input',
            message: 'Enter the new department name: '
        },
        {
            name: 'overhead_cost',
            type: 'input',
            message: "Enter the department's overhead cost base:  "
        }
    ])
    .then( function (answer){
        let overhead_num = parseInt(answer.overhead_cost);

        connection.query("INSERT INTO departments SET ?",
            {
                department_name:  answer.department_name,
                overhead_costs: overhead_num
            },
            function(err, response) {
                console.log(response.affectedRows + " department created.\n");
                exitOption();
            }
        )

    })
}




function exitOption() {
    inquirer
        .prompt([
            {
                name: 'exit_choice',
                type: 'rawlist',
                message: 'Would you like to return to the Main Menu?',
                choices: [ 'Exit' , 'Return to Main Menu']
            }
        ])
        .then( function (answer){
            if ( answer.exit_choice == 'Exit') {
                console.log ("\n------------------------\nExiting Supervisor View.  Goodbye.\n------------------------");
                connection.end();
            } else {
                console.log('\n----------------------------------');
                startSupervisor();
            }
        })
}