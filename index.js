const express = require('express');
const app = express();
const multiFruitBasket = require('./multiFruitBasket');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/multiBaskets';

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