const assert = require('assert');
const multiFunctions = require('../multiFruitBasket')
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/multiBaskets';

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});
