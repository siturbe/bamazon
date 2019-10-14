CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price INTEGER(10) DEFAULT 1,
  stock_quantity INTEGER(10) DEFAULT 1,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Braveheart", "Movies", 14, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Interstellar", "Movies", 15, 44);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Avatar", "Movies", 15, 22);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Invisible Man", "Books", 12, 9);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Song of Solomon", "Books", 13, 26);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Farenheit 451", "Books", 14, 34);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wiper Blades", "Car Parts", 22, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Solar Shade", "Car Parts", 19, 90);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Drain-O", "Cleaning Supplies", 9, 34);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Windex", "Cleaning Supplies", 13, 122);