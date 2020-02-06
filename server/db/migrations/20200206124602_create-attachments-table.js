exports.up = function(knex) {
  return knex.schema.createTable('attachments', (table) => {
    table.increments().notNullable(); //attachment id
    table.string('url').unique().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.integer('note_id').unsigned().notNullable();
    table.foreign('note_id').references('id').inTable('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('attachments');
};

