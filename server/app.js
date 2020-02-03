const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//express-graphql module allows express to understand graphql queries
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const { createNote, notesByUserId } = require('./controllers/notes');

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
    }

    input NoteInput {
      user_id: String!
      title: String!
      body: String
    }

    type RootQuery {
      notes(user_id: ID!): [Note!]!
    }

    type RootMutation {
      createNote(noteInput: NoteInput): Note
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    notes: (args) => {
      return notesByUserId(args.user_id);
    },
    createNote: async (args) => {
      const { noteInput } = args;
      const newNote = await createNote({
        user_id: noteInput.user_id,
        title: noteInput.title,
        body: noteInput.body || ''
      });
      return newNote[0];
    }
  },
  graphiql: true
}));

app.use(bodyParser.json());

app.listen(4000, () => {
  console.log('App listening on port 4000');
});
