const SqLiteOptions = require('./config.js');
const knexSQLite = require('knex')(SqLiteOptions);

const createContainerTable = async knex => {
    await knex.schema.createTable('container', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('price').notNullable();
    });
}

const createProductTable = async knex => {
    await knex.schema.createTable('productos', table => {
        table.increments('id').primary();
        table.integer('stock').notNullable();
        table.string('name').notNullable();
        table.integer('code').notNullable();
        table.integer('price').notNullable();
        table.string('description').notNullable();
        table.string('thumbnail').notNullable();
        table.timestamp('timeStamp').defaultTo(knex.fn.now());
    });
}

const createCartTable = async knex => {
    await knex.schema.createTable('carritos', table => {
        table.increments('id').primary();
        table.timestamp('timeStamp').defaultTo(knex.fn.now());
    });
}

const createListPTable = async knex => {
    await knex.schema.createTable('listP', table => {
        table.integer('cart_id').notNullable().unsigned().references('id').inTable('carritos').primary();
        table.integer('product_code').notNullable().unsigned().references('code').inTable('productos');
    });
}

createContainerTable(knexSQLite);
createProductTable(knexSQLite);
createCartTable(knexSQLite);
createListPTable(knexSQLite);