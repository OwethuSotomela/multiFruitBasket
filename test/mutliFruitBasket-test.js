const assert = require('assert');
const multiFruits = require('../multiFruitBasket')
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/multiBaskets';

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const multiBasket = multiFruits(pool)

beforeEach(async function () {
    await pool.query("DELETE FROM fruit_basket_item");
    await pool.query("DELETE FROM multi_fruit_basket")
});

describe('Create a fruit basket', async function () {
    it('Should create a new fruit basket', async function () {

        await multiBasket.createBasket("Banana", 1, 3)
        await multiBasket.createBasket("Apple", 1, 5)
        await multiBasket.createBasket("Orange", 1, 5)

        assert.deepEqual([
            {
                "name": "Banana"
            },
            {
                "name": "Apple"
            },
            {
                "name": "Orange"
            }
        ]
            , await multiBasket.getBasket())
    });
});

describe('Adding to Existing Basket', async function () {
    it('Should add fruit to an existing basket', async function () {
        await multiBasket.createBasket("Banana", 1, 3)
        await multiBasket.createBasket("Apple", 1, 5)
        await multiBasket.createBasket("Orange", 1, 5)

        await multiBasket.addFruit("Banana", 3, 9)
        await multiBasket.addFruit("Apple", 3, 5)
        await multiBasket.addFruit("Orange", 3, 5)

        assert.deepEqual([
            {
                "fruit_type": "Banana",
                "price": "3.00",
                "quantity": "1",
            },
            {
                "fruit_type": "Apple",
                "price": "5.00",
                "quantity": "1"
            },
            {
                "fruit_type": "Orange",
                "price": "5.00",
                "quantity": "1"
            },
            {
                "fruit_type": "Banana",
                "price": "9.00",
                "quantity": "3"
            },
            {
                "fruit_type": "Apple",
                "price": "5.00",
                "quantity": "3"
            },
            {
                "fruit_type": "Orange",
                "price": "5.00",
                "quantity": "3"
            }
        ]
            , await multiBasket.getFruit())
    })
});
