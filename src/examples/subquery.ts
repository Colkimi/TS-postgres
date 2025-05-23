import { executeQuery } from '../config/database';

(async () => {
  try {
    // 1. Subquery in SELECT: show product and how many times it's been ordered
    const subqueryInSelect = `
      SELECT 
        p.product_id,
        p.name AS product_name,
        p.price,
        (
          SELECT COUNT(*) 
          FROM orders o 
          WHERE o.product_id = p.product_id
        ) AS order_count
      FROM products p
    `;
    const result1 = await executeQuery(subqueryInSelect);
    console.log('Products with their order count (Subquery in SELECT):');
    console.table(result1.rows);

    // 2. Subquery in WHERE: products that have been ordered at least once
    const subqueryInWhere = `
      SELECT * FROM products
      WHERE product_id IN (
        SELECT DISTINCT product_id FROM orders
      )
    `;
    const result2 = await executeQuery(subqueryInWhere);
    console.log('Products that have been ordered (Subquery in WHERE):');
    console.table(result2.rows);

    // 3. Correlated subquery: Get latest order date for each customer
    const correlatedSubquery = `
      SELECT 
        customer_name,
        (
          SELECT MAX(order_date)
          FROM orders o
          WHERE o.customer_name = c.customer_name
        ) AS latest_order_date
      FROM customers c
    `;
    const result3 = await executeQuery(correlatedSubquery);
    console.log('Latest order date per customer (Correlated Subquery):');
    console.table(result3.rows);

    // 4. Subquery in FROM: average price comparison
    const subqueryInFrom = `
SELECT 
  p.name AS product_name,
  p.price,
  avg_table.avg_price
FROM products p,
  (
    SELECT AVG(price::numeric) AS avg_price
    FROM products
  ) avg_table
WHERE p.price::numeric > avg_table.avg_price;

    `;
    const result4 = await executeQuery(subqueryInFrom);
    console.log('Products priced above average (Subquery in FROM):');
    console.table(result4.rows);

    // 5. EXISTS clause: customers who have placed an order
    const subqueryWithExists = `
      SELECT * FROM customers c
      WHERE EXISTS (
        SELECT 1 FROM orders o WHERE o.customer_name = c.customer_name
      )
    `;
    const result5 = await executeQuery(subqueryWithExists);
    console.log('Customers who have placed orders (EXISTS Subquery):');
    console.table(result5.rows);

    console.log('All subquery operations completed successfully');
  } catch (error) {
    console.error('Error executing subquery examples:', error);
  }
})();
