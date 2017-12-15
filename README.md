# Bamazon_app

An Amazon-like storefront with the MySQL. This app will take in orders from customers and deplete stock from the store's inventory, Track product sales across store's departments and then provide a summary of the highest-grossing departments in the store.

### Customer Interface

The customer interface allows the user to view the current inventory of store items: item IDs, descriptions, department in which the item is located and price. The user is then able to purchase one of the existing items by entering the item ID and the desired quantity. If the selected quantity is currently in stock, the user's order is fulfilled, displaying the total purchase price and updating the store database. If the desired quantity is not available, the user is prompted to modify their order.

To run the customer interface please follow the steps below:

`git clone git@github.com:lavanya128/Bamazon_app.git`

`cd Bamazon_app`

`npm install`

`node bamazonCustomer.js`

### Manager Interface

The manager interface presents a list of four options, as below:

`? Please select an option: (Use arrow keys)`

`❯ View Products for Sale` 

`View Low Inventory`

`Add to Inventory`

`Add New Product`

The _View Products for Sale_ option allows the user to view the current inventory of store items: item IDs, descriptions, department in which the item is located, price, and the quantity available in stock.

The _View Low Inventory_ option shows the user the items which currently have fewer than 100 units available.

The _Add to Inventory_ option allows the user to select a given item ID and add additional inventory to the target item.

The _Add New Product_ option allows the user to enter details about a new product which will be entered into the database upon completion of the form.

To run the manager interface please follow the steps below:

`git clone git@github.com:lavanya128/Bamazon_app.git`

`cd Bamazon_app`

`npm install`

`node bamazonManager.js`

