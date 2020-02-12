const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const schema = require('./schema');

//express-graphql module allows express to understand graphql queries
const graphqlHttp = require('express-graphql');

const User = require('./controllers/user');

app.use(cors());
app.use(bodyParser.json());

//middleware for all protected routes
const authenticate = (request, response, next) => {
  const token = request.headers['x-authentication-token'];

  if (!token) {
    response.sendStatus(401);
    return;
  }

  User.getByToken(token)
    .then((user) => {
      if (!user) {
        response.sendStatus(401);
        return;
      }

      //if user exists and the token is valid, allow the request
      request.authenticatedUser = user;
      next();
    });
};

//TODO
//figure out how to alloq login and register without token authentication
app.use(authenticate);

//graphql middleware
//if API request is made to the following enpoint
//the handling will be passed onto graphqlHTTP
app.use('/graphql', graphqlHttp(request => ({
  schema,
  graphiql: true,
  context: {
    authenticatedUser: request.authenticatedUser
  }
})));

app.listen(4000, () => {
  console.log('App listening on port 4000');
});
