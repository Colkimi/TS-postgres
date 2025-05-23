import { executeQuery } from "../config/database";



export const union =   async():Promise<string[]>=>{
    try{
    const result=await  executeQuery(`
            SELECT orders.customer_name FROM orders
            UNION
            SELECT customers.customer_name FROM customers;
        
    `);
    return result.rows;
}catch(error){
    console.log(error);
    throw error
}
}

export const unionAll = async():Promise<string[]>=>{
    try{
    const result=await  executeQuery(`
            SELECT orders.customer_name FROM orders
            UNION  ALL
            SELECT customers.customer_name FROM customers;
    `);
    return result.rows;
}catch(error){
    console.log(error);
    throw error
}
}

export const intersect = async():Promise<string[]>=>{
    try{
    const result=await  executeQuery(`
            SELECT orders.customer_name FROM orders
            INTERSECT
            SELECT customers.customer_name FROM customers;
    `);
    return result.rows;
}catch(error){
    console.log(error);
    throw error
}
}

export const except = async():Promise<string[]>=>{
    try{
    const result=await  executeQuery(`
            SELECT orders.customer_name FROM orders
            EXCEPT
            SELECT customers.customer_name FROM customers;
    `);
    return result.rows;
}catch(error){
    console.log(error);
    throw error
}
}

export const excepttwo = async():Promise<string[]>=>{
    try{
    const result=await  executeQuery(`
            SELECT customers.customer_name FROM customers
            EXCEPT
            SELECT orders.customer_name FROM orders;
    `);
    return result.rows;
}catch(error){
    console.log(error);
    throw error
}
}

