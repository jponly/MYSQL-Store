var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("console.table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "jpsql008$",
	database: "bamazonDB"
});


connection.connect(function (err) {
	if (err) throw err;

});

managerMenu();

//function that gives the user a menu of actions
function managerMenu() {
	inquirer.prompt([
		{
			type: 'list',
			message: 'Select Bamazon Management Activity:',
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
			name: 'options'
		}
	]).then(function (results) {
		switch (results.options) {
			case "View Products for Sale":
				inventoryTable();
				break;
			case "View Low Inventory":
				reviewStock();
				break;
			case "Add to Inventory":
				changeStockQty();
				break;
			case "Add New Product":
				addItem();
				break;
			case 'Exit':
				console.log("Back to CLI...");
				process.exit(0);
				break;
		}
	});
};



//function that prints a table of current items available
function inventoryTable() {
	connection.query('SELECT * FROM products', function (err, results) {
		if (err) throw err;
		console.table(results);
	});
};

//function to print a table of low stck items (below qty of 5)
function reviewStock() {
	connection.query('SELECT * from products  WHERE stock_quantity < 5', function (err, results) {
		if (err) throw err;
		console.table(results);


	});

};

//Function to dynamically update inventory quantities 
function changeStockQty() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'To update stock please enter item ID #:',
			name: 'product'
		},
		{
			type: 'input',
			message: 'Please enter adjustment amount:',
			name: 'quantity'
		}
	]).then(function (answer) {
		var quantity = parseInt(answer.quantity);
		var product = answer.product;
		var currentQuantity;
		//Select the record from products table with an item_id = the user's answer
		connection.query('SELECT stock_quantity FROM products WHERE item_id=?', [product], function (err, results) {
			currentQuantity = parseInt(results[0].stock_quantity);
			//Update the stock_quantity to the user's adjustment qty
			connection.query('UPDATE products SET ? WHERE item_id=?',
				[
					{ stock_quantity: quantity + currentQuantity },
					product
				],
				function (err, results) {
					if (err) throw err;
					if (quantity && product !== undefined) {
						console.log("\n Stock is updated. Please review the adjustment:");
						console.log("");
					}
				});
		});
	});
};

//function to add a new item to the database
function addItem() {
	connection.query("SELECT * FROM departments", function (err, results) {
		if (err) throw err;

		inquirer.prompt([
			{
				type: 'input',
				message: 'Please enter product name.',
				name: 'item_name'
			},
			{
				type: 'input',
				message: 'Please enter retail price.',
				name: 'price'
			},
			{
				type: 'list',
				message: 'Please select a department for this item.',
				choices: function () {
					var choiceArray = [];
					for (var i = 0; i < results.length; i++) {
						choiceArray.push(results[i].department_name);
					}
					return choiceArray;
				},
				name: 'department_name'
			},
			{
				type: 'input',
				message: 'Please enter initial stock quantity.',
				name: 'stock_quantity'
			}
		]).then(function (answers) {
			var item_name = answers.item_name;
			var price = answers.price;
			var stock_quantity = answers.stock_quantity;
			var department_name = answers.department_name;
			//connect to db and insert the new record with user supplied values
			connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)', [item_name, department_name, price, stock_quantity], function (err, results) {
				if (err) throw err;
			});
			if (item_name && price && stock_quantity && department_name !== undefined) {
			}
			else {
				managerMenu();
			}

		});
	});
};

