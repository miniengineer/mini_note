const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
    fields: ( ) => ({
      id: { type: GraphQLID },
      username: { type: GraphQLString },
      password: { type: GraphQLString },
      token: { type: GraphQLString },
      notes: {
        type: new GraphQLList(NotesType),
        resolve(parent, args){
          console.log({parent, args});
          return _.find(notes, { user_id: parent.id });
        }
      }
    })
});

const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: ( ) => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
    attachments: {
      type: new GraphQLList(AttachmentType),
      resolve(parent, args){
        console.log({ parent, args });
        return _.find(attachments, { note_id: parent.id });
      }
    }
  })
});

const AttachmentType = new GraphQLObjectType({
  name: 'Attachment',
  fields: () => ({
    id: { type: GraphQLID },
    url: { type: GraphQLString },
    created_at: { type: GraphQLString }
  })
});

