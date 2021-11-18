
DROP TABLE IF EXISTS multi_fruit_basket CASCADE;
CREATE TABLE multi_fruit_basket (
    id serial NOT NULL PRIMARY KEY,
    name text NOT NULL
);

DROP TABLE IF EXISTS fruit_basket_item CASCADE;
CREATE TABLE fruit_basket_item (
    id serial NOT NULL PRIMARY KEY,
    fruit_type text NOT NULL,
    quantity NUMERIC NOT NULL,
    price DECIMAL(10,2),
    multi_fruit_basket_id int NOT NULL,
    foreign key (multi_fruit_basket_id) references multi_fruit_basket(id)
);

-- INSERT INTO multi_fruit_basket (name) VALUES ('Banana');
-- INSERT INTO multi_fruit_basket (name) VALUES ('Apple');
-- INSERT INTO multi_fruit_basket (name) VALUES ('Orange');
