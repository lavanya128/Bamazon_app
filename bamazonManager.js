var inquirer = require('inquirer');
var mysql = require('mysql');

// Define the MySQL connection parameters
var connection = mysql.createConnection({
	host: 'localhost',
	port: 8889,

	// Your username
	user: 'root',

	// Your password
	password: 'root',
	database: 'bamazon'
});


function promptManagerAction() {
	
	// Prompt the manager to select an option
	inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: 'Please select an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			filter: function (opt) {
				if (opt === 'View Products for Sale') {
					return 'sale';
				} else if (opt === 'View Low Inventory') {
					return 'lowInventory';
				} else if (opt === 'Add to Inventory') {
					return 'addInventory';
				} else if (opt === 'Add New Product') {
					return 'newProduct';
				} else {
					// Exit
					console.log('ERROR: Exit');
					exit(1);
				}
			}
		}
	]).then(function(input) {
		
		if (input.option ==='sale') {
			displayInventory();
		} else if (input.option === 'lowInventory') {
			displayLowInventory();
		} else if (input.option === 'addInventory') {
			addInventory();
		} else if (input.option === 'newProduct') {
			createNewProduct();
		} else {
			// This case should be unreachable
			console.log('ERROR:Operation not supported!');
			exit(1);
		}
	})
}

function displayInventory() {
		// Construct the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log(data);
		console.log("---------------------------------------------------------------------\n");

		// End the database connection
		connection.end();
	})
}

function displayLowInventory() {
	queryStr = 'SELECT * FROM products WHERE stock_quantity < 5';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Low Inventory Items (below 5): ');
		console.log(data);

		console.log("---------------------------------------------------------------------\n");

		// End the database connection
		connection.end();
	})
}

function addInventory() {
	
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID for stock total update.'
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to add?'
			
		}
	]).then(function(answer) {
		
		var item = answer.item_id;
		var addQuantity = answer.quantity;

		// Query db to confirm that the given item ID exists and to determine the current stock_count
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				addInventory();

			} else {
				var productData = data[0];

				console.log('Updating Inventory...');

				// Construct the updating query string
				var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
				// console.log('updateQueryStr = ' + updateQueryStr);

				// Update the inventory
				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
					console.log("\n---------------------------------------------------------------------\n");

					// End the database connection
					connection.end();
				})
			}
		})
	})
}

function createNewProduct() {
	
	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price per unit?',
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'How many items are in stock?',
		}
	]).then(function(input) {
		// console.log('input: ' + JSON.stringify(input));

		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
									   '    department_name = ' + input.department_name + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock_quantity = ' + input.stock_quantity);

		// Create the insertion query string
		var queryStr = 'INSERT INTO products SET ?';

		// Add new product to the db
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;

			console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
			console.log("\n---------------------------------------------------------------------\n");

			// End the database connection
			connection.end();
		});
	})
}

function bamazon() {
	
	promptManagerAction();
}

bamazon();
