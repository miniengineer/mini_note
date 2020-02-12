const graphql = require('graphql');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList
} = graphql;

//controllers
const Note = require('./controllers/notes');
const User = require('./controllers/user');

const checkPassword = (password, hash) => {
  return new Promise((resolve, reject) =>
    bcrypt.compare(password, hash, (err, res) => {
      return err ? reject(err) : resolve(res);
    })
  );
};

const UserType = new GraphQLObjectType({
  name: 'User',
    fields: () => ({
      id: { type: GraphQLID },
      username: { type: GraphQLString },
      password: { type: GraphQLString },
      token: { type: GraphQLString },
      notes: {
        type: new GraphQLList(NoteType),
        resolve(parent, args){
          return Note.findByUserId(parent.id);
        }
      }
    })
});

const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
    attachments: {
      type: new GraphQLList(AttachmentType),
      resolve(parent, args){
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

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    login: {
      type: GraphQLString,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const user = await User.findByUsername(args.username);

        if (!user) {
          throw new Error('Not a valid user!');
        }

        const validUser = await checkPassword(args.password, user.password_digest);
        if (!validUser) {
          throw new Error('Unauthorized!');
        }

        user.token = await User.addToken(user.id);

        return user.token;
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args) {
        const user = await User.findById(args.id);
        return user;
      }
    }
    //TODO
    //add register query (mutation probably?)
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
