const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//express-graphql module allows express to understand graphql queries
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

let notes = [];

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
      title: String!
      body: String
    }

    type RootQuery {
      notes: [Note!]!
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
    notes: () => {
      return notes;
    },
    createNote: (args) => {
      const { noteInput } = args;
      const note = {
        id: Math.random().toString(),
        title: noteInput.title,
        body: noteInput.body || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      notes.push(note);
      return note;
    }
  },
  graphiql: true
}));

app.use(bodyParser.json());

app.listen(4000, () => {
  console.log('App listening on port 4000');
});
