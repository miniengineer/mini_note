const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile.js')[environment];
const database = require('knex')(configuration);

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

module.exports = {
  addUser,
};
