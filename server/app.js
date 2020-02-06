const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//express-graphql module allows express to understand graphql queries
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const {
  addNote,
  notesByUserId
} = require('./controllers/notes');
const { addUser } = require('./controllers/user');
const { addAttachment } = require('./controllers/attachments');

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

app.use(bodyParser.json());

//graphql middleware
//if API request is made to the following enpoint
//the handling will be passed onto graphqlHTTP
app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Note {
      id: ID!
      title: String!
      body: String
      created_at: String
      updated_at: String
      user_id: String!
    }

    input NoteInput {
      user_id: String!
      title: String!
      body: String
    }

    type User {
      id: ID!
      username: String!
      password_digest: String
      token: String!
      created_at: String
    }

    input UserInput {
      username: String!
      password: String!
    }

    type Attachment {
      id: ID!
      url: String!
      user_id: ID!
      note_id: ID!
    }

    input AttachmentInput {
      url: String!
      user_id: ID!
      note_id: ID!
    }

    type RootQuery {
      notes(user_id: ID!): [Note!]!
    }

    type RootMutation {
      createNote(noteInput: NoteInput): Note
      createUser(userInput: UserInput): String
      createAttachment(attachmentInput: AttachmentInput): ID
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    notes: (args) => {
      try {
        return notesByUserId(args.user_id);
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
  },
  graphiql: true
}));


app.listen(4000, () => {
  console.log('App listening on port 4000');
});
