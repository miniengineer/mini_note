const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const addNote = (note) => {
  return database('notes').insert({
    title: note.title,
    body: note.body,
    user_id: note.user_id
  }, ['id', 'title', 'body', 'created_at', 'updated_at'])
    .then(noteArr => noteArr[0])
    .catch(err => console.error(err));
};

const notesByUserId = (user_id) => {
  return database('notes').select().where({
    user_id
  })
    .then(result => result)
    .catch(err => console.error(err));
};

module.exports = {
  addNote,
  notesByUserId
};
