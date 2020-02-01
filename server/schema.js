const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID
} = graphql;
const _ = require('lodash');

const userSchemas = require('./schemas/user');
const noteSchemas = require('./schemas/notes');

const dummyData = [
  { user_id: '1', title: 'New Note', body: 'I am a new note' },
  { user_id: '2', title: 'Steak recipe', body: 'I am a  steak recipe' }
];

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
