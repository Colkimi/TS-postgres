
import { executeQuery, initializeTables } from './config/database';
import { insertProduct, insertMultipleProducts, insertOrder,TProduct,TOrder,queryProducts,getOrdersWithProductInfo,TorderWithProduct,TCustomer, insertCustomer, } from './examples/query';
import { filterProductsByPrice, filterOrdersByDate } from './examples/filter';
import { nullifExample, caseExample, coalesceExample, castExample } from './examples/conditional-operators';
import {getSalesByGroupingSets, getSalesByRollup, getSalesByCube} from './examples/aggregationQueries';
import {getProductsAboveAveragePrice,getTopSellingProducts,getProductDetails} from './examples/cte';
import  {union,unionAll,intersect,except,excepttwo}  from    './examples/setoperations';
import  {copyingTables,addColumn,alterColumn,renameColumn,renametable,truncatetable,droptable}  from    './examples/managingtables';

// Self-executing async function to run the imported code
(async () => {
    try {
        // 1. Create tables if they don't exist
        // await initializeTables();
        // getSalesByGroupingSets();
        // getProductsAboveAveragePrice();
        // getTopSellingProducts(2);
        getProductDetails(1);

        // 2. Insert a test product
        // const productId = await insertProduct({ name: 'Headphones', stock_quantity: 100, price:150 });
        // console.log(`Inserted product with ID: ${productId}`);

        // 3. Insert multiple products with a transaction
        const productsToInsert: TProduct[] = [
            { name: 'Speaker', stock_quantity: 200, price:200 },
            {  name: 'Amplifier', stock_quantity: 50, price:250 },
            {  name: 'Phones', stock_quantity: 60, price:300 },
            {  name: 'Laptop', stock_quantity: 90, price:350 },
            {  name: 'Chargers', stock_quantity: 150, price:400 },
            {  name: 'adapters', stock_quantity: 300, price:500 },
        ];
        // await insertMultipleProducts(productsToInsert);
        
        const ordersToAdd: TOrder[] = [
            { order_id: 1, product_id: 1, quantity_ordered: 2, customer_name: 'Mibey', order_date: new Date('2025-04-10') },
            { order_id: 2, product_id: 2, quantity_ordered: 4, customer_name: 'James', order_date: new Date('2025-04-13') },
            { order_id: 3, product_id: 3, quantity_ordered: 6, customer_name: 'Colkimi', order_date: new Date('2025-04-15') },
            { order_id: 4, product_id: 4, quantity_ordered: 9, customer_name: 'Mike', order_date: new Date('2025-04-17') },
            { order_id: 5, product_id: 5, quantity_ordered: 12, customer_name: 'Simon', order_date: new Date('2025-04-20') },
            { order_id: 6, product_id: 6, quantity_ordered: 1, customer_name: 'Bruno', order_date: new Date('2025-04-11') },
            { order_id: 7, product_id: 7, quantity_ordered: 6, customer_name: 'Titus', order_date: new Date('2025-04-16') },
        ];
    
        for (const order of ordersToAdd) {
            await insertOrder(order);
        }     
        const customersToAdd: TCustomer[] = [
            { customer_name:'Mibey', email: 'mibey@example.com', phone: '22730173823', address: 'Mibey street', registered_at: new Date('2025-04-10') },
            { customer_name:'Bruno', email: 'bruno@example.com', phone: '22273017473', address: 'bruno street', registered_at: new Date('2025-04-10') },
            { customer_name:'Tito', email: 'tito@example.com', phone: '2730173213', address: 'tito street', registered_at: new Date('2025-04-10') },
            { customer_name:'Mkubwa', email: 'mkubwa@example.com', phone: '12273017382337', address: 'mkubwa street', registered_at: new Date('2025-04-10') },
            { customer_name:'Mike', email: 'mike@example.com', phone: '27301738233516', address: 'mike street', registered_at: new Date('2025-04-10') },
            { customer_name:'James', email: 'james@example.com', phone: '227301738236371', address: 'james street', registered_at: new Date('2025-04-10') },
            { customer_name:'Final', email: 'final@example.com', phone: '227301738231238', address: 'final street', registered_at: new Date('2025-04-10') },
        ];
        for (const customer of customersToAdd) {
            await insertCustomer(customer);
        }
        const customers = await(customersToAdd)
        console.log('All customers in database:');
        console.table(customers);
        // 4. Query all products to verify
        // const products = await queryProducts();
        // console.log('All products in database:');
        // console.table(products);

        // 5. Delete all products
        // await deleteAllProducts();

        //Set Operations
        const resultUnion=await union();
        console.log('Union Result:', resultUnion)

        const resultUnionAll=await unionAll();
        console.log('Union  All Result:', resultUnionAll)

        const resultIntersect=await intersect();
        console.log('Intersect Result:', resultIntersect)

        const resultExcept=await except();
        console.log('Except Result:', resultExcept)

        const resultExcepttwo=await excepttwo();
        console.log('Except Inverse Result:', resultExcepttwo)

        //Managing tables
        console.log('Copying table result:');
        console.table(await copyingTables());

        console.log('Add column result:');
        console.table(await addColumn());

        console.log('Rename column result:');
        console.table(await renameColumn());

        console.log('Alter column result:');
        console.table(await alterColumn());

        console.log('Rename table result:');
        console.table(await renametable());

        console.log('Truncate table result:');
        console.table(await truncatetable());

        console.log('Drop table result:');
        console.log(await droptable());

        console.log('All operations completed successfully');
    } catch (error) {
        console.error('Error executing database operations:', error);
    }
})();