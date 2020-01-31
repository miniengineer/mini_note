exports.up = function(knex) {
  return knex.schema.createTable('notes', (table) => {
    table.increments().notNullable(); //note id
    table.string('title').notNullable();
    table.text('body');
    table.string('updated_at');
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notes');
};
