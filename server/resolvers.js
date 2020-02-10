const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { addNote, notesByUserId } = require('./controllers/notes');
const { addUser } = require('./controllers/user');
const { addAttachment, getAttachments } = require('./controllers/attachments');

const hashPassword = (password) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      return err ? reject(err) : resolve(hash);
    })
  );
};

const createToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'));
    })
  });
};

const root = {
  notes: async (args) => {
    console.log(args);
    let result;
    try {
      result = await notesByUserId(args.user_id);
      console.log({ result });
      result.attachments = await root.attachments(args.user_id);
    } catch(err) {
      console.error(err);
    }
    console.log({ result });
    return result;
  },

  attachments: (args) => {
    try {
      return getAttachments({
        user_id: args.user_id,
        note_id: args.note_id
      });
    } catch(err) {
      console.error(err);
    }
  },

  createNote: (args) => {
    try {
      return addNote({
        user_id: args.noteInput.user_id,
        title: args.noteInput.title,
        body: args.noteInput.body || ''
      });
    } catch(err) {
      console.error(err);
    }
  },

  createUser: async (args) => {
    const hashedPassword = await hashPassword(args.userInput.password);
    const token = await createToken();
    delete args.userInput.password;
    try {
      return addUser({
        username: args.userInput.username,
        password_digest: hashedPassword,
        token: token
      });
    } catch(err) {
      console.error(err);
    }
  },

  createAttachment: (args) => {
    try {
      return addAttachment({
        url: args.attachmentInput.url,
        user_id: args.attachmentInput.user_id,
        note_id: args.attachmentInput.note_id
      });
    } catch (err) {
      console.error(err);
    }
  }
};

module.exports = {
  root
};
