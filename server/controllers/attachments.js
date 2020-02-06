const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const addAttachment = async (url, user_id, note_id) => {
  let newAttachment;
  try {
    newAttachment = await database('attachments').insert({
      url,
      user_id,
      note_id
    }, ['id']);
  } catch(err) {
    console.error(err);
  }
  return newAttachment[0];
}

module.exports = {
  addAttachment,
}
