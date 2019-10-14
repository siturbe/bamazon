const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'
});

connection.connect(function(err){
    if (err) throw err;
    startCustomer();
});


function startCustomer(){
    console.log("Welcome to Bamazon!  Please browse our inventory below:");
    connection.query("SELECT * FROM products", function (err, results){
        if (err) throw err;
        console.log("-----------------------------------------");
        for (let i=0;  i<results.length; i++) {
            console.log("Product ID: " + results[i].item_id + ",    " + results[i].product_name + ",   Price: $" + results[i].price + ",    Units Available: " + results[i].stock_quantity + ",    Department: " + results[i].department_name);
        }
        console.log("-----------------------------------------");
        inquirer
            .prompt([
                {
                    name: 'choice',
                    type: 'input',
                    message: ' Select the item you would like to purchase by entering its Product ID:'
                },
                {
                    name: 'quantity',
                    type: 'input',
                    message: 'What quantity of this item would you like to purchase?'
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
                    let new_quantity = chosenItem.stock_quantity - answer.quantity;

                    console.log("---------------------------\nYou have selected " + quantity_num + " units of " + chosenItem.product_name + ".\n---------------------------");
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

                            if ( chosenItem.stock_quantity >=  quantity_num ) {
                                connection.query(
                                    "UPDATE products SET ? WHERE ?",
                                    [
                                        { stock_quantity:  new_quantity },
                                        { item_id: chosenItem.item_id }
                                    ],
                                    function (error) {
                                        if (error) throw err;
                                        console.log("\n------------------------------\nPurchase successful.");
                                        let itemTotal = chosenItem.price * answer.quantity;
                                        console.log("Cost of purchase was: $" + itemTotal + "\n----------------------------------");
                                        exitOption();
                                    }
                                )
                            } else {
                                console.log("Insufficient quantity!")
                            }

                        }
                        else {
                            console.log("Canceling this order. \n----------------------------");
                            exitOption();
                        }
                    })
                
                    
                }
            })
    })

}


function exitOption() {
    inquirer
        .prompt([
            {
                name: 'exit_choice',
                type: 'rawlist',
                message: 'Would you like to continue shopping?',
                choices: [ 'Exit' , 'Continue Shopping']
            }
        ])
        .then( function (answer){
            if ( answer.exit_choice == 'Exit') {
                console.log ("\n------------------------\nThanks for shopping at Bamazon.  Come back soon!\n------------------------");
                connection.end();
            } else {
                console.log('\n----------------------------------');
                startCustomer();
            }
        })
}


