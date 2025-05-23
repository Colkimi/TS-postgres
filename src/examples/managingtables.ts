import db, { executeQuery } from "../config/database";
import { TProduct } from '../examples/query';

export interface TNewProduct extends TProduct {
    class?: string;
}

export const copyingTables = async (): Promise<TProduct[]> => {
    try {
    const client=await  db.getPool().connect()
    try{
        await  client.query("BEGIN")
        await client.query(`
        DROP TABLE IF EXISTS new_products;
        CREATE TABLE new_products (LIKE products INCLUDING ALL);
        INSERT INTO new_products
        SELECT * FROM products;
        `);
        const result = await client.query(`
        SELECT * FROM new_products
        `);
        await  client.query("COMMIT")
        return result.rows;
        } catch (error) {
            await  client.query("ROLLBACK")
            throw error;
        }finally{
            client.release();
        }
    }catch(error){
    console.error("Error copying table and data:", error);
    throw error;
    }
};

export const addColumn = async (): Promise<TNewProduct[]> => {
    try {
        await executeQuery(`
        ALTER TABLE new_products ADD COLUMN class VARCHAR(100)
        `);
        const result = await executeQuery(`
        SELECT * FROM new_products
        `);
        return result.rows;
    } catch (error) {
        console.error("Error adding column table and data:", error);
        throw error;
    }
};

export const renameColumn = async (): Promise<TNewProduct[]> => {
    try {
        await executeQuery(`
        ALTER TABLE new_products RENAME COLUMN class TO category
        `);
        const result = await executeQuery(`
        SELECT * FROM new_products
        `);
        return result.rows;
    } catch (error) {
        console.error("Error renaming column:", error);
        throw error;
    }
};

export const alterColumn = async (): Promise<TNewProduct[]> => {
    try {
        await executeQuery(`
        ALTER TABLE new_products ALTER COLUMN stock_quantity TYPE smallint
        `);
        const result = await executeQuery(`
        SELECT * FROM new_products
        `);
        return result.rows;
    } catch (error) {
        console.error("Error altering column type:", error);
        throw error;
    }
};

export const renametable = async (): Promise<TNewProduct[]> => {
    try {
        await executeQuery(`
        ALTER TABLE new_products RENAME TO fresh_products
        `);
        const result = await executeQuery(`
        SELECT * FROM fresh_products
        `);
        return result.rows;
    } catch (error) {
        console.error("Error renaming table:", error);
        throw error;
    }
};

export const truncatetable = async (): Promise<TNewProduct[]> => {
    try {
        await executeQuery(`
        TRUNCATE TABLE fresh_products
        `);
        const result = await executeQuery(`
        SELECT * FROM fresh_products
        `);
        return result.rows;
    } catch (error) {
        console.error("Error truncating table:", error);
        throw error;
    }
};

export const droptable = async (): Promise<void> => {
    try {
        await executeQuery(`
        DROP TABLE IF EXISTS fresh_products
        `);
    } catch (error) {
        console.error("Error dropping table:", error);
        throw error;
    }
};



