const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const addNote = async (note) => {
  let noteArr;
  try {
    noteArr= await database('notes').insert({
      title: note.title,
      body: note.body,
      user_id: note.user_id
    }, ['id', 'title', 'body', 'created_at', 'updated_at']);
  } catch(err) {
    console.error(err);
  }
  return noteArr[0];
};

const notesByUserId = async (user_id) => {
    let notes;
    try {
      notes = await database('notes').select().where({
        user_id
      });
    } catch(err) {
      console.error(err);
    }
    return notes;
};

module.exports = {
  addNote,
  notesByUserId
};
