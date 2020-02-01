const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const createNote = (note) => {
  return database('notes').insert({
      title: note.title,
      body: note.body,
      user_id: note.user_id
    },
    ['id', 'title', 'body', 'created_at', 'updated_at']);
};

const notesByUserId = (user_id) => {
  return database('notes').select().where({
    user_id
  });
};

module.exports = {
  createNote,
  notesByUserId
};
