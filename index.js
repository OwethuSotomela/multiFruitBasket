const express = require('express');
const app = express();
const multiFruitBasket = require('./multiFruitBasket');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/travis_ci_test';

const pool = new Pool({
	connectionString: connectionString,
	ssl: {
		rejectUnauthorized: false
	}
});

const PORT = process.env.PORT || 1111
app.listen(PORT, function(){
    console.log("App started at port", PORT);
});