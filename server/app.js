const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//express-graphql module allows express to understand graphql queries
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

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
      return [
        { id: '1', user_id: '1', title: 'New Note', body: 'I am a new note', created_at: '19/01/2019', updated_at: '' },
        { id: '2', user_id: '2', title: 'Steak recipe', body: 'I am a  steak recipe', created_at: '19/01/2019', updated_at: '' }
      ];
    },
    createNote: (args) => {
      const { user_id, title, body } = args;
      return { user_id, title, body };
    }
  },
  graphiql: true
}));

app.use(bodyParser.json());

app.listen(4000, () => {
  console.log('App listening on port 4000');
});
