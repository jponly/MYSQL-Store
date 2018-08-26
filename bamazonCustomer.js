var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "jpsql008$",
  database: "bamazonDB"
});

var orderTotal = 0;

connection.connect(function (err) {
  if (err) throw err;

});


function inventoryTable() {
  var sqlString = "SELECT * FROM products";
  connection.query(sqlString, function (err, results) {
    if (err) throw err;
    console.table(results);
    customerBuy();

  });


}

inventoryTable();

function customerBuy() {
  inquirer.prompt([

    {
      type: 'input',
      message: 'Select an item to purchase by entering the item ID:\n',
      name: 'itemID',
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }

    },

    {
      type: 'input',
      message: 'How many would you like to buy:',
      name: 'quantity',
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function (answer) {
    var itemID = answer.itemID;
    var quantity = answer.quantity;
    connection.query('SELECT * FROM products WHERE item_id=?', [itemID], function (err, results) {
      if (err) throw err;
      var stock_quantity = results[0].stock_quantity;
      if (stock_quantity < quantity) {
        console.log("Insufficient stocks is available to fulfill your request. Please enter an amount equal to or less than the available stock.");
      } else {
        stock_quantity -= quantity;

        var totalPrice = quantity * results[0].price;
        var totalSales = totalPrice + results[0].total_sales;
        var department = results[0].department_name;

        console.log("\nYour line item total on this product: $" + (quantity * results[0].price).toFixed(2));

        orderTotal += (parseFloat(totalPrice));
        console.log("\nYour order total for all products this session: ") + ("$" + orderTotal.toFixed(2)) + "\n";

        connection.query('UPDATE products SET ? WHERE item_id=?', [{ stock_quantity: stock_quantity }, itemID], function (err, results) {
          if (err) throw err;
        });


        connection.query('SELECT total_sales FROM departments WHERE department_name=?', [department], function (err, results) {
          if (err) throw err;
          var departmentTotal = results[0].total_sales + totalPrice;
          connection.query('UPDATE departments SET total_sales=? WHERE department_name=?', [departmentTotal, department], function (err, results) {
            if (err) throw err;
          });
        });

        //Continue Shopping Prompt
        inquirer.prompt([
          {
            type: "confirm",
            message: "Would you like to continue shopping?",
            name: "yesOrNo",
            default: true
          }
        ]).then(function (data) {
          if (data.yesOrNo) {
            inventoryTable();
          } else {
            console.log("Thanks for your business! Come back again soon.");
            process.exit(0);
          }
        });
      }
    });
  });
}


