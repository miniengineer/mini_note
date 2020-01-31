module.exports = {
  development: {
    client: 'pg',
    connection:'postgres://localhost/mini_note',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL ||
    `postgres://${process.env.USER}@127.0.0.1:5432/mini_note`,
    useNullAsDefault: true,
    migrations: {
      tableName: "knex_migrations",
      directory: "./db/migrations"
    }
  }
};
