const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID
} = graphql;
const _ = require('lodash');

const dummyData = [
  { user_id: '1', title: 'New Note', body: 'I am a new note' },
  { user_id: '2', title: 'Steak recipe', body: 'I am a  steak recipe' }
];

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password_digest: { type: GraphQLString },
    token: { type: GraphQLString }
  })
});

const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    note: {
      type: NoteType,
      args: { user_id: { type: GraphQLID } },
      resolve(parent, args){
        return _.find(dummyData, { user_id: args.user_id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
