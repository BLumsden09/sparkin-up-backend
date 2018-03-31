const ExecutableSchema = require('graphql-tools')
const resolvers = require('./resolvers')

const typeDefs = [`
    type User {
        email: String
        password: String
        firstName: String
        lastName: String
        skills: [String]
    }
    type Query {
        allUsers(searchTerm: String): [User]
    }
`];

const schema = ExecutableSchema.makeExecutableSchema({
    typeDefs,
    resolvers
});

module.exports = schema
