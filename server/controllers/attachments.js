const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const addAttachment = async (attachment) => {
  let newAttachment;
  try {
    newAttachment = await database('attachments').insert({
      url: attachment.url,
      user_id: attachment.user_id,
      note_id: attachment.note_id
    }, ['id']);
  } catch(err) {
    console.error(err);
  }
  return newAttachment[0].id;
};

const getAttachments = async (user_id, note_id) => {
  let attachments;
  try {
    attachments = await database('attachments').select().where({
      user_id: args.user_id,
      note_id: args.note_id
    });
  } catch(err) {
    console.error(err);
  }
  console.log(attachments);
  return attachments;
};

module.exports = {
  addAttachment,
  getAttachments
}
