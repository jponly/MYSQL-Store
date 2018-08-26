DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
   item_id INT  AUTO_INCREMENT,
   product_name VARCHAR(50) NOT NULL,
   department_name VARCHAR(100) NOT NULL,
   price DECIMAL(10,2) NOT NULL,
   stock_quantity INT NULL,
   PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT(20) NOT NULL AUTO_INCREMENT,
   department_name VARCHAR(50) NOT NULL,
   overhead_costs DECIMAL(10,2) NOT NULL,
   total_sales DECIMAL(10,2) NOT NULL,
   PRIMARY KEY (department_id)
 
);


 SELECT * FROM products;
 SELECT * FROM products WHERE stock_quantity < 5;
 SELECT * FROM departments;


INSERT INTO departments (department_name ,overhead_costs , total_sales)
 VALUES ('Shoes', 25000.00, 13000.00),
        ('Accessories', 2000.00, 3000.00),
        ('Cleaner', 25000.00, 1300.00);

INSERT INTO products (product_name ,department_name , price, stock_quantity)
 VALUES ("Air Jordan 2","Shoes", 350.86, 85);

INSERT INTO products (product_name ,department_name , price, stock_quantity)
 VALUES ("Adidas Ultra Boost grn","Shoes", 180.45, 150);

INSERT INTO products (product_name ,department_name , price, stock_quantity)
 VALUES ("Fila JS","Shoes", 89.76, 205);

INSERT INTO products (product_name ,department_name , price, stock_quantity)
 VALUES ("Nike Air Max 95 Slr Rd","Shoes", 285.92, 3);
 
INSERT INTO products (product_name ,department_name , price, stock_quantity)
 VALUES ("Reebok Pump","Shoes", 78.54, 238);

INSERT INTO products (product_name ,department_name , price, stock_quantity)
 VALUES ("Power Laces","Accessories", 12.56, 0);
 
INSERT INTO products (product_name ,department_name , price, stock_quantity)
 VALUES ("Shoe Horn","Accessories", 2.95, 359);
 
INSERT INTO products (product_name ,department_name , price, stock_quantity)
 VALUES ("Dry Steppers","Accessories", 25.49, 134);

INSERT INTO products (product_name ,department_name , price, stock_quantity)
 VALUES ("Reshoeven8tr","Cleaner", 5.68, 260);
 






