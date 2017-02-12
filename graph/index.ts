import * as query from './schema/query';
import * as mutation from './schema/mutation';
import * as resolver from './resolvers';
const { makeExecutableSchema } = require('graphql-tools');

export default makeExecutableSchema({
    typeDefs: [ 
        query.Query, //query.Room, query.Stuff,
        mutation.Mutation, //mutation.RoomInput, mutation.StuffInput
    ],
    resolvers: {
        Query: resolver.Query,
        Mutation: resolver.Mutation,
        Room: resolver.Room,
        User: resolver.User,
        Stuff: resolver.Stuff
    }
});