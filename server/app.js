const express = require('express');

//express-graphql module allows express to understand graphql queries
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

//graphql middleware
//if API request is made to the following enpoint
//the handling will be passed onto graphqlHTTP
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('App listening on port 4000');
});
