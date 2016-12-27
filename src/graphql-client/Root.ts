const { Query, Room, Stuff } = require('./schema');
const { makeExecutableSchema } = require('graphql-tools');

const Schema = makeExecutableSchema({
    typeDefs: [Query, Room, Stuff],
    resolvers: {}
});

module.exports = {};

