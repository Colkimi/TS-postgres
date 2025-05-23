import db from '../config/database';

export async function performTransactionalModifications() {
    const client = await db.getPool().connect();

    try {
        await client.query('BEGIN'); // start transaction
        console.log('Transaction started.');

        await client.query('SAVEPOINT before_modifications'); // set restoration point
        console.log('Savepoint created.');

        // Insert
        await client.query(`
            INSERT INTO products (name, price, stock_quantity)
            VALUES ($1, $2, $3)
        `, ['Temporary Gadget', '999', 50]);
        console.log('Insert completed.');

        // Update
        await client.query(`
            UPDATE products
            SET price = $1
            WHERE name = $2
        `, ['777', 'Phones']);
        console.log('Update completed.');

        // Delete
        await client.query(`
            DELETE FROM orders
            WHERE customer_name = $1
        `, ['Final']);
        console.log('Delete completed.');

        // Upsert (insert or update if exists)
        await client.query(`
            INSERT INTO products (product_id, name, price, stock_quantity)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (product_id)
            DO UPDATE SET
                name = EXCLUDED.name,
                price = EXCLUDED.price,
                stock_quantity = EXCLUDED.stock_quantity
        `, [1, 'Updated Product', '123', 100]);
        console.log('Upsert completed.');

        // ROLLBACK to the savepoint
        await client.query('ROLLBACK TO SAVEPOINT before_modifications');
        console.log('Rolled back to savepoint.');

        //  COMMIT the transaction if needed
        await client.query('COMMIT');
        console.log('Transaction committed (but changes after savepoint were undone).');
    } catch (err) {
        console.error('Error during transaction. Rolling back completely...', err);
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
}
