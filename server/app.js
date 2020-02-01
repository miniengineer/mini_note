const express = require('express');
const app = express();

//express-graphql module allows express to understand graphql queries
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

//graphql middleware
//if API request is made to the following enpoint
//the handling will be passed onto graphqlHTTP
app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type RootQuery {

    }

    type RootMutation {

    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {},
  graphiql: true
}));

app.use(bodyParser.json());

app.listen(4000, () => {
  console.log('App listening on port 4000');
});
