const mongoose = require('mongoose')
const userModel = require('./models/user')

const resolvers = {
    Query: {
        allUsers: (root, {searchTerm}) => {
            if (searchTerm !== '')
                return userModel.find({$text: {$search: searchTerm}}).sort({lastName: 'asc'});
            else
                return userModel.find().sort({lastName: 'asc'});
        }
    }
}

module.exports = resolvers
