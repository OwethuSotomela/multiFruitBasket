const assert = require('assert');
const multiFruits = require('../multiFruitBasket')
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/travis_ci_test';

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const multiBasket = multiFruits(pool)

beforeEach(async function () {
    await pool.query("DELETE FROM fruit_basket_item");
});


describe('Create a fruit basket', async function () {
    it('Should create a new fruit basket', async function () {

        await multiBasket.createBasket("Banana", 1, 3)
        await multiBasket.createBasket("Apple", 1, 5)
        await multiBasket.createBasket("Orange", 1, 5)

        assert.deepEqual([{ "name": "Banana" }, { "name": "Apple" }, { "name": "Orange" }], await multiBasket.getBasket())
    });
});

describe('Adding to Existing Basket', async function () {
    it('Should add fruit to an existing basket', async function () {
        await multiBasket.createBasket("Banana", 1, 3)
        await multiBasket.createBasket("Apple", 1, 5)
        await multiBasket.createBasket("Orange", 1, 5)

        await multiBasket.addFruit("Banana", 4, 3)
        await multiBasket.addFruit("Apple", 8, 5)
        await multiBasket.addFruit("Orange", 20, 5)

        assert.deepEqual([{
            "fruit_type": "Banana",
            "price": "3.00",
            "quantity": "5",
        },
        {
            "fruit_type": "Apple",
            "price": "5.00",
            "quantity": "9"
        },
        {
            "fruit_type": "Orange",
            "price": "5.00",
            "quantity": "21"
        },

        ], await multiBasket.getFruit())
    });

})

describe('Remove fruit', async function () {
    it('Should remove fruit from an existing basket', async function () {

        await multiBasket.createBasket("Banana", 1, 3)
        await multiBasket.createBasket("Apple", 1, 5)
        await multiBasket.createBasket("Orange", 1, 5)

        await multiBasket.removeFruit("Banana", 3, 9)
        await multiBasket.removeFruit("Apple", 3, 5)
        await multiBasket.removeFruit("Orange", 3, 5)

        assert.deepEqual([], await multiBasket.getFruit())
    })
})

describe('Returning Basket Names', async function () {
    it('Should return the basket_name & id as well as a list of all the fruits in the basket', async function () {


        await multiBasket.createBasket("Banana", 1, 3)
        await multiBasket.createBasket("Apple", 1, 5)
        await multiBasket.createBasket("Orange", 1, 5)

        var idOfBanana = await multiBasket.getId("Banana")

        assert.deepEqual([
            {
                name: 'Banana'
            },
            {
                name: 'Apple'
            },
            {
                name: 'Orange'
            }
        ]

            , await multiBasket.getBasket())

        assert.deepEqual([
            {
                "fruit_type": "Banana",
                "price": "3.00",
                "quantity": "1"
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
            }
        ]
            , await multiBasket.getFruit())

        assert.deepEqual([
            {
                "fruit_type": "Banana",
                "name": 'Banana',
                "multi_fruit_basket_id": idOfBanana[0].id,
                "price": "3.00",
                "quantity": "1"
            }
        ]
            , await multiBasket.getBasketById(idOfBanana[0].id))
    });

    it('Should return the basket_name & id as well as a list of all the fruits in the basket', async function () {


        await multiBasket.createBasket("Banana", 1, 3)
        await multiBasket.createBasket("Apple", 1, 5)
        await multiBasket.createBasket("Orange", 1, 5)

        var idOfBanana = await multiBasket.getId("Banana")

        assert.deepEqual([
            {
                "fruit_type": "Banana",
                "multi_fruit_basket_id": idOfBanana[0].id,
                "name": 'Banana',
                "price": "3.00",
                "quantity": "1"
            }
        ]
            , await multiBasket.getBasketById(idOfBanana[0].id))
    });
});

describe('Show total cost', async function () {
    it('Should return the total cost of a specific basket based on basket name', async function () {

        await multiBasket.createBasket("Banana", 18, 3)
        await multiBasket.createBasket("Apple", 3, 5)
        await multiBasket.createBasket("Orange", 10, 5)

        assert.deepEqual([
            {
                total_cost: '54.00'
            }
        ]
            , await multiBasket.totalCostByName("Banana"))

    })

    it('Should return the total cost of a specific basket based on basket id', async function () {

        await multiBasket.createBasket("Banana", 18, 3)
        await multiBasket.createBasket("Apple", 3, 5)
        await multiBasket.createBasket("Orange", 10, 5)

        var idOfApple = await multiBasket.getId("Apple")

        assert.deepEqual([
            {
                total_cost: '15.00'
            }
        ]
            , await multiBasket.totalCostById(idOfApple[0].id))
    })
})

