exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments().notNullable(); //user id
    table.string('username').unique().notNullable();
    table.text('password_digest');
    table.string('token');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};

