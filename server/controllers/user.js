const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile.js')[environment];
const database = require('knex')(configuration);

const crypto = require('crypto');

const createToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'));
    })
  });
};

const findByUsername = async (username) => {
  let user;
  try {
    user = await database('users').select().where({
      username
    });
  } catch(err) {
    console.error(err);
  }

  return user[0];
}

const addUser = async (user) => {
  let newUser;
  try {
    newUser = await database('users').insert({
      username: user.username,
      password_digest: user.password_digest,
      token: user.token,
      created_at: new Date()
    }, ['username', 'password_digest', 'token']);
  } catch(err) {
    console.error(err);
  }

  return newUser[0].token;
};

const addToken = async (id) => {
  const token = await createToken();
  const result = await database('users').where({ id })
  .update({ token }, ['token']);
  return result[0].token;
};

module.exports = {
  addUser,
  findByUsername,
  addToken
};
