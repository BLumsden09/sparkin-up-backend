const mongoose = require('mongoose')
const ExecutableSchema = require('graphql-tools')
const resolvers = require('./resolvers')

const typeDefs = [`
    type User {
        _id: String!
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        skills: [String]
    }

    type LoginObject {
        secret: String!
        token: String
    }

    input userChanges {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        skills: [String]
    }

    type Query {
        allUsers(searchTerm: String): [User!]!
        getUser(_id: String!): User
    }
    type Mutation {
        deleteUser(_id: String!): User
        updateUser(_id: String!, changedUser: userChanges): User!
        login(email: String!, password: String!): String!
        register(email: String!, password: String!, firstName: String!, lastName: String!): User!
    }
`];

const schema = ExecutableSchema.makeExecutableSchema({
    typeDefs,
    resolvers
});

module.exports = schema
