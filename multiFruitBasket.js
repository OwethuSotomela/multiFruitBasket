module.exports = function MultiFruitBasket(pool) {

    async function createBasket(fruit, qty, price) {

        var multiFruitCart = await pool.query(`SELECT * FROM multi_fruit_basket WHERE name = $1`, [fruit])
        if (multiFruitCart.rows.length === 0) {
            await pool.query(`INSERT INTO multi_fruit_basket (name) VALUES ($1)`, [fruit])
        }
        var afterInserting = await pool.query(`SELECT * FROM multi_fruit_basket WHERE name = $1`, [fruit])
        await pool.query(`INSERT INTO fruit_basket_item (fruit_type, quantity, price, multi_fruit_basket_id) VALUES ($1, $2, $3, $4)`, [fruit, qty, price, afterInserting.rows[0].id])
        console.log(afterInserting.rows)
    }

    async function getBasket() {
        var getBasket = await pool.query("SELECT name FROM multi_fruit_basket");
        return getBasket.rows;
    }

    async function getFruit() {
        var getFruit = await pool.query("SELECT fruit_type, quantity, price FROM fruit_basket_item");
        console.log(getFruit.rows)
        return getFruit.rows;
    }

    async function addFruit(fruit, qty, price) {
        var multiFruitCart = await pool.query(`SELECT * FROM fruit_basket_item WHERE fruit_type = $1`, [fruit])
        if (multiFruitCart.rows.length != 0) {
            await pool.query(`UPDATE multi_fruit_basket SET name = name WHERE name = $1`, [fruit])
        }
        var afterUpdating = await pool.query(`SELECT * FROM multi_fruit_basket WHERE name = $1`, [fruit])
        await pool.query(`INSERT INTO fruit_basket_item (fruit_type, quantity, price, multi_fruit_basket_id) VALUES ($1, $2, $3, $4)`, [fruit, qty, price, afterUpdating.rows[0].id])
        console.log(afterUpdating.rows)
    }

    async function removeFruit() {

    }

    return {
        createBasket,
        addFruit,
        removeFruit,
        getFruit,
        getBasket
    }
}