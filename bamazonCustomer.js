var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, data) {
    if (err) throw err;
    console.log(data);
    promptUsers(data);
    //connection.end();
 console.log('Existing Inventory: ');
    console.log('...................\n');

    var strOut = '';
    for (var i = 0; i < data.length; i++) {
      strOut = '';
      strOut += 'Item ID: ' + data[i].item_id + '  //  ';
      strOut += 'Product Name: ' + data[i].product_name + '  //  ';
      strOut += 'Department: ' + data[i].department_name + '  //  ';
      strOut += 'Price: $' + data[i].price + '\n';

      console.log(strOut);
    }

      console.log("---------------------------------------------------------------------\n");
      //connection.end();

  });
}

function promptUsers(stock){
inquirer.prompt([
{
  type: "input",
  name: "itemId",
  message: "What is the ID of the item to be purchased?"
},
{
  type: 'input',
  name: 'quantity',
  message: 'How many do you need?',
}

  ]).then(function(answer){
    var item = parseInt(answer.itemId);
    var quantity = answer.quantity;
    console.log(item);

    var queryStr = 'SELECT * FROM products WHERE ?';

    connection.query(queryStr, {item_id: item}, function(err, data) {
      if (err) throw err;
      if (data.length === 0) {
        console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
        //displayInventory();

      } else {
        var productData = data[0];

          if (quantity <= productData.stock_quantity) {
          console.log('Congratulations, the product you requested is in stock! Placing order!');

          var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
          
          connection.query(updateQueryStr, function(err, data) {
            if (err) throw err;

            console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
            console.log('Thank you for shopping with us!');

            afterConnection();
            connection.end();
          })
        } else {
          console.log('Sorry, Insufficient quantity, your order can not be placed as is.');
          console.log('Please modify your order.');
          console.log("\n---------------------------------------------------------------------\n");

          afterConnection();
          
        }

   }
    })
  })
}

