// src/config/database.ts
import env from './env'
import { Pool, PoolConfig, QueryResult } from 'pg'

class Database {
    private pool: Pool;
    
    constructor() {
        const poolConfig: PoolConfig = {
            host: env.database.host,
            port: env.database.port,
            user: env.database.user,
            password: env.database.password,
            database: env.database.database,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
            // For production with SSL:
            // ssl: {
            //   rejectUnauthorized: false
            // }
        };
        
        this.pool = new Pool(poolConfig);
        
        this.pool.on('connect', () => {
            console.log('Connected to PostgreSQL database');
        });
        
        this.pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }
    
    async executeQuery(text: string, params: any[] = []): Promise<QueryResult> {
        const client = await this.pool.connect();
        try {
            const start = Date.now();
            const result = await client.query(text, params);
            const duration = Date.now() - start;
            console.log(`Executed query: ${text} - Duration: ${duration}ms`);
            return result;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        } finally {
            client.release();
        }
    }
    
    async initializeTables(): Promise<void> {
        try {
            await this.executeQuery(`
              DROP TABLE IF EXISTS orders CASCADE;
              DROP TABLE IF EXISTS products CASCADE;
              DROP TABLE IF EXISTS customers CASCADE;
           `);

            // create users table
            await this.executeQuery(`
                CREATE TABLE products (
                    product_id SERIAL PRIMARY KEY,
                    name VARCHAR(50) NOT NULL,
                    price VARCHAR(50) NOT NULL,
                    stock_quantity INT,
                    
                    created_at TIMESTAMPTZ DEFAULT NOW()
                )
            `);

            await this.executeQuery(`
                CREATE TABLE orders (
                    order_id SERIAL PRIMARY KEY,
                    product_id INT REFERENCES products(product_id),
                    quantity_ordered INT NOT NULL,
                    customer_name VARCHAR(50),

                    order_date TIMESTAMPTZ DEFAULT NOW()
                )
            `);
            await this.executeQuery(`
                CREATE TABLE customers (
                    customer_id SERIAL PRIMARY KEY,
                    customer_name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE,
                    phone VARCHAR(20),
                    address TEXT,
                    registered_at TIMESTAMPTZ DEFAULT NOW()
                )
            `);
            console.log('Products and orders table created or already exists');

            // create other tables as needed
            console.log('Database schema initialized successfully');
        } catch (err) {
            console.error('Error initializing database:', err);
            throw err;
        }
    }
    
    getPool(): Pool {
        return this.pool;
    }
}

// Create singleton instance
const db = new Database();

// Export instance methods and the database object
export const executeQuery = (text: string, params: any[] = []) => db.executeQuery(text, params);
export const initializeTables = () => db.initializeTables();
export default db;