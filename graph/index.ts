import * as resolver from './resolvers';
const { makeExecutableSchema } = require('graphql-tools');
const Schema = require('./schema/Schema.json');

export default makeExecutableSchema({
    typeDefs: Schema,
    resolvers: {
        Query: resolver.Query,
        Mutation: resolver.Mutation,
        Subscription: resolver.Subscription,
        Room: resolver.Room,
        User: resolver.User,
        Stuff: resolver.Stuff,
        Order: resolver.Order
    }
});