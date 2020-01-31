const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    password_digest: { type: GraphQLString },
    token: { type: GraphQLString }
  })
});

const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: () => ({
    id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    title: { type: GraphQLString },
    text: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    note: {
      type: NoteType,
      args: { user_id: { type: GraphQLString } },
      resolve(parent, args){
        //code to get data from db
        args.user_id
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
