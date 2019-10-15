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
    startManager();
});


function startManager(){
    inquirer
        .prompt({
            name: 'option',
            type: 'rawlist',
            message: 'MENU:  ',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
        })
        .then(function(answer){
            let path = answer.option;
            switch (path){
                case "View Products for Sale":
                    return viewProducts();
                case 'View Low Inventory':
                    return lowInventory();
                case 'Add to Inventory':
                    return addInventory();
                case 'Add New Product':
                    return addNewProduct();
                case 'Exit':
                    return exitOption();
            }
        })
}


function viewProducts(){
    console.log("Welcome to Bamazon Manager Inventory View:");
    connection.query("SELECT * FROM products", function (err, results){
        if (err) throw err;
        let table = new Table({
            head: [ "Product ID", "Product Name", "Price $", "Units Available", "Department" ],
            colWidths: [15, 40, 15, 20, 30]
        });
        console.log("-----------------------------------------");
        for (let i=0;  i<results.length; i++) {
            table.push([results[i].item_id, results[i].product_name, results[i].price, results[i].stock_quantity, results[i].department_name]);
        }
        console.log(table.toString());
        console.log("-----------------------------------------");
        exitOption();
    })
}


function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <5", function (err, results) {
        if (err) throw err;
        let table = new Table({
            head: [ "Product ID", "Product Name", "Price $", "Units Available", "Department" ],
            colWidths: [15, 40, 15, 20, 30]
        });
        console.log("\n-----------------------------------------");
        for (let i=0;  i<results.length; i++) {
            table.push([results[i].item_id, results[i].product_name, results[i].price, results[i].stock_quantity, results[i].department_name]);
        }
        console.log(table.toString());
        console.log("-----------------------------------------");
        exitOption();
    })
    
}


function addInventory(){
    connection.query("SELECT * FROM products", function (err, results){
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'choice',
                    type: 'input',
                    message: "For which item would you like to buy more inventory?  Input the Product ID:  "
                },
                {
                    name: 'quantity',
                    type: 'input',
                    message:  "How many units of this item would you like to add?"
                }
            ])
            .then( function(answer){
                let chosenItem;
                let valid_entry = false;
                for (let i = 0; i<results.length; i++){
                    if (results[i].item_id == answer.choice){
                        chosenItem = results[i];
                        valid_entry = true;
                    }
                };

                if ( valid_entry === false) {
                    console.log("That Product ID does not exit.  Sorry.");
                    exitOption();
                } else {

                    let quantity_num = parseInt(answer.quantity); 
                    let new_quantity = parseInt(chosenItem.stock_quantity) + quantity_num;

                    console.log("---------------------------\nYou have selected to add "  + quantity_num + " units of " + chosenItem.product_name + ".\n---------------------------");
                    inquirer
                    .prompt([
                        {
                            name: 'confirm',
                            type: 'confirm',
                            message: "Is the above summary correct? \n---------------------------",
                        }
                    ])
                    .then( function (response){
                        if( response.confirm) {
                            console.log("Confirmed");
                            connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    { stock_quantity:  new_quantity },
                                    { item_id: chosenItem.item_id }
                                ],
                                function (error) {
                                    if (error) throw err;
                                    console.log("\n------------------------------\nInventory addition successful.");
                                    exitOption();
                                }
                            )

                        }
                        else {
                            console.log("Canceling this inventory order. \n----------------------------");
                            exitOption();
                        }
                    })
                
                    
                }
            })
        })
}



function addNewProduct(){
    connection.query("SELECT * FROM departments", function(err, results){
        if(err) throw err;
        inquirer
            .prompt([
                {
                    name: 'product_name',
                    type: 'input',
                    message: 'Enter the product name: '
                },
                {
                    name: 'department_name',
                    type: 'rawlist',
                    message: 'Which department should this product be under: ',
                    choices: function(){
                        let choiceArray = [];
                        for (let i=0; i<results.length; i++) {
                            choiceArray.push(results[i].department_name);
                        }
                        return choiceArray;
                    }
                },
                {
                    name: 'price',
                    type: 'input',
                    message: 'Enter the retail price of the product: '
                },
                {
                    name: 'stock_quantity',
                    type: 'input',
                    message: 'Enter the initial number of units in inventory: '
                },
                {
                    name: 'unit_cost',
                    type: 'input',
                    message: 'Enter the wholesale cost per unit: '
                }
            ])
            .then( function (answer){
                let price_num = parseInt(answer.price);
                let quantity_num = parseInt(answer.stock_quantity);
                let cost_num = parseInt(answer.unit_cost);

                connection.query("INSERT INTO products SET ?",
                    {
                        product_name:  answer.product_name,
                        department_name:  answer.department_name,
                        price: price_num,
                        stock_quantity:  quantity_num,
                        unit_cost: cost_num,
                        product_sales: 0,
                        product_cogs: 0
                    },
                    function(err, response) {
                        console.log(response.affectedRows + " product inserted.\n");
                        exitOption();
                    }
                )

            })
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
                console.log ("\n------------------------\nExiting Manager View.  Goodbye.\n------------------------");
                connection.end();
            } else {
                console.log('\n----------------------------------');
                startManager();
            }
        })
}

