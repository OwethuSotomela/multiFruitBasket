module.exports = function MultiFruitBasket(pool) {


    async function createBasket(fruit, qty, price) {

        var multiFruitCart = await pool.query(`SELECT * FROM multi_fruit_basket WHERE name = $1`, [fruit])
        if (multiFruitCart.rows.length === 0) {
            await pool.query(`INSERT INTO multi_fruit_basket (name) VALUES ($1)`, [fruit])
        }
        var afterInserting = await pool.query(`SELECT * FROM multi_fruit_basket WHERE name = $1`, [fruit])
        await pool.query(`INSERT INTO fruit_basket_item (fruit_type, quantity, price, multi_fruit_basket_id) VALUES ($1, $2, $3, $4)`, [fruit, qty, price, afterInserting.rows[0].id])
    }

    async function getBasket() {
        var getBasket = await pool.query("SELECT name FROM multi_fruit_basket");
        return getBasket.rows;
    }

    async function addFruit(fruit, qty, price) {
        var multiFruitCart = await pool.query(`SELECT * FROM fruit_basket_item WHERE fruit_type = $1`, [fruit])
        if (multiFruitCart.rows.length != 0) {
            await pool.query(`UPDATE multi_fruit_basket SET name = name WHERE name = $1`, [fruit])
        }
        var afterUpdating = await pool.query(`SELECT * FROM multi_fruit_basket WHERE name = $1`, [fruit])
        if (afterUpdating.rows.length != 0) {
            await pool.query(`UPDATE fruit_basket_item SET quantity = quantity + $2 WHERE fruit_type = $1`, [fruit, qty])
        } else {
            await pool.query(`INSERT INTO fruit_basket_item (fruit_type, quantity, price, multi_fruit_basket_id) VALUES ($1, $2, $3, $4)`, [fruit, qty, price, afterUpdating.rows[0].id])
        }
        // await pool.query(`INSERT INTO fruit_basket_item (fruit_type, quantity, price, multi_fruit_basket_id) VALUES ($1, $2, $3, $4)`, [fruit, qty, price, afterUpdating.rows[0].id])
        // console.log(afterUpdating.rows)
    }

    async function getId(fruitName) {
        var IdOfFruitNamePassed = await pool.query(`SELECT id FROM multi_fruit_basket WHERE name = $1`, [fruitName])
        return IdOfFruitNamePassed.rows;
    }

    async function getFruit() {
        var getFruit = await pool.query("SELECT fruit_type, quantity, price FROM fruit_basket_item");
        return getFruit.rows;
    }

    async function removeFruit(fruit) {
        var fruitItems = await pool.query(`SELECT * FROM fruit_basket_item WHERE fruit_type = $1`, [fruit])
        if (fruitItems.rows.length != 0) {
            await pool.query(`DELETE FROM fruit_basket_item WHERE fruit_type = $1`, [fruit])
        }
        var afterDeletingItem = await pool.query(`SELECT * FROM multi_fruit_basket WHERE name = $1`, [fruit])
        if (afterDeletingItem.rows.length != 0) {
            await pool.query(`DELETE FROM multi_fruit_basket WHERE name = $1`, [fruit])
        }
    }

    async function getBasketById(multi_fruit_basket_id) {
        var fruitItems = await pool.query(`SELECT fruit_basket_item.*, multi_fruit_basket.name FROM fruit_basket_item INNER JOIN multi_fruit_basket ON fruit_basket_item.multi_fruit_basket_id = multi_fruit_basket.id WHERE fruit_basket_item.multi_fruit_basket_id = ${multi_fruit_basket_id}`)
        return fruitItems.rows;
    }

    async function prepopulate() {
        var multiBasketNames = pool.query(`SELECT * FROM multi_fruit_basket`)
        return multiBasketNames.rows
    }

    async function totalCostByName(fruit) {
        var multiFruitCart = await pool.query(`SELECT name FROM multi_fruit_basket WHERE name = $1`, [fruit])
        var basketPrice = await pool.query(`SELECT SUM(price * quantity) AS total_cost FROM fruit_basket_item WHERE fruit_type = $1`, [multiFruitCart.rows[0].name])
        return basketPrice.rows
    }

    async function totalCostById(multi_fruit_basket_id) {
        var multiFruitCart = await pool.query(`SELECT id FROM multi_fruit_basket WHERE id = ${multi_fruit_basket_id}`)
        var basketPrice = await pool.query(`SELECT SUM(price * quantity) AS total_cost FROM fruit_basket_item WHERE multi_fruit_basket_id = $1`, [multiFruitCart.rows[0].id])
        return basketPrice.rows
    }

    return {
        createBasket,
        getFruit,
        addFruit,
        removeFruit,
        getBasket,
        getBasketById,
        prepopulate,
        getId,
        totalCostByName,
        totalCostById
    }
}
