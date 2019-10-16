# bamazon
Bamazon is the result of a project used to teach students how to code using Node and MySQL.  

Video to the App Working
https://drive.google.com/file/d/1e-sCgUfp0-u6mUqTTwjQFfIQMFeVtbVX/view?usp=sharing
If the mp4 file does not work directly form Github, you can click on the link above.  You may have to download the video to watch it.


The "schema" file shows the code used to create the initial tables in MySQL

bamazonCustomer.js is the node applicaiton that can be run from the terminal where a customer can see available inventory and mimic purchases.

bamazonManager.js is the node application that can be run from the terminal where a manager can see the available products, see which product lines are low on inventory, add inventory to existing product lines, or add new products to bamazon's offering.

bamazonSupervisor.js is the node application that can be run from the terminal where a supervisor can see what the income statement looks like by department, and where a new department can be created.

All three node applications interact, share, and modify the same data base, simulating what they would do to inventory and sales at a real store.