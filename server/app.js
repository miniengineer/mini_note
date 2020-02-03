const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//express-graphql module allows express to understand graphql queries
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const { addNote, notesByUserId } = require('./controllers/notes');

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
    }
  },
  graphiql: true
}));


app.listen(4000, () => {
  console.log('App listening on port 4000');
});
