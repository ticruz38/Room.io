import * as schema from './schema';
import * as resolver from './resolvers';
const { makeExecutableSchema } = require('graphql-tools');

export default makeExecutableSchema({
    typeDefs: [ schema.Query, schema.Room, schema.Stuff ],
    resolvers: {
        Query: resolver.Query,
        Room: resolver.Room,
        Stuff: resolver.Stuff
    }
});