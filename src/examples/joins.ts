import { executeQuery, initializeTables } from '../config/database';
import { insertProduct, insertMultipleProducts, insertOrder,TProduct,TOrder,queryProducts,TorderWithProduct,queryOrders } from '../examples/query';

(async () => {
    try {
         
        const query1 = `
            SELECT 
                orders.order_id AS order_id,
                orders.quantity_ordered,
                customers.customer_id AS customer_id,
                customers.customer_name AS customer_name
            FROM orders
            INNER JOIN customers ON orders.customer_name = customers.customer_name
        `;
  const result1 = await executeQuery(query1);
  console.log('Orders with product info (INNER JOIN result):');
  console.table( result1.rows);

//  LEFT JOIN to get all products and their orders 
const query2 = `
    SELECT 
        products.product_id AS product_id,
        products.name AS product_name,
        products.price,
        orders.order_id AS order_id,
        orders.quantity_ordered
    FROM products
    LEFT JOIN orders ON products.product_id = orders.product_id
`;
  const result2 = await executeQuery(query2);
  console.log('Orders with product info (LEFT JOIN result):');
  console.table(result2.rows);

    const query3 = `
    SELECT 
      orders.order_id AS order_id,
      orders.quantity_ordered,
      products.product_id AS product_id,
      products.name AS product_name,
      products.price
    FROM orders
    RIGHT JOIN products ON orders.product_id = products.product_id
  `;
  const result3 = await executeQuery(query3);
  console.log('Orders with product info (RIGHT JOIN result):');
  console.table(result3.rows);
   
const query4 = `
    SELECT 
      orders.order_id AS order_id,
      orders.quantity_ordered,
      products.product_id AS product_id,
      products.name AS product_name,
      products.price
    FROM orders
    FULL OUTER JOIN products ON orders.product_id = products.product_id
  `;
  const result4 = await executeQuery(query4);
  console.log('Orders with product info (FULL OUTER JOIN result):');
  console.table(result4.rows);
   
    const query5 = `
    SELECT 
      products.product_id AS product_id,
      products.name AS product_name,
      products.price,
      orders.order_id AS order_id,
      orders.quantity_ordered
    FROM products
    CROSS JOIN orders
  `;
  const result5 = await executeQuery(query5);
  console.log('Orders with product info (CROSS JOIN result):');
  console.table(result5.rows);

      const query6 = `
    SELECT 
      products.product_id AS product_id,
      products.name AS product_name,
      products.price,
      orders.order_id AS order_id,
      orders.quantity_ordered
    FROM products
    NATURAL JOIN orders
  `;
  const result6 = await executeQuery(query6);
  console.log('Orders with product info (NATURAL JOIN result):');
  console.table(result6.rows);


    // Example of a self join: Find pairs of products with the same price

    const selfJoinQuery = `
      SELECT 
        p1.product_id AS product1_id,
        p1.name AS product1_name,
        p2.product_id AS product2_id,
        p2.name AS product2_name,
        p1.price
      FROM products p1
      INNER JOIN products p2 ON p1.price = p2.price AND p1.product_id < p2.product_id
    `;
    const selfJoinResult = await executeQuery(selfJoinQuery);
    console.log('Pairs of products with the same price (SELF JOIN result):');
    console.table(selfJoinResult.rows);

        console.log('All operations completed successfully');
    } catch (error) {
        console.error('Error executing database operations:', error);
    }
})();
