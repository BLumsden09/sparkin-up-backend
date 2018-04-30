const mongoose = require('mongoose')
const userModel = require('./models/user')
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt')
const config = require('./config/database');
const jwt = require('jsonwebtoken')

const resolvers = {
    Query: {
        allUsers: (root, {searchTerm}) => {
          if (searchTerm !== '')
              return userModel.find({$text: {$search: searchTerm}}).sort({lastName: 'asc'});
          else
              return userModel.find().sort({lastName: 'asc'});
        },
        getUser: (root, {_id}) =>{
          return userModel.findOne(ObjectId(_id));
        }
    },
    Mutation: {
        register: async (root, args) => {
          const user = args;
          user.password.plaintext = await bcrypt.hash(user.password, 12);
          debugger;
          return userModel.create(user);
        },
        deleteUser: (root, {_id}) => {
          return userModel.deleteOne({_id: ObjectId(_id)});
        },
        updateUser: async (root, {_id, changedUser}) => {
          changedUser.password = await bcrypt.hash(changedUser.password, 12);
          const userValues = {$set: {email: changedUser.email, password: changedUser.password,
                              firstName: changedUser.firstName, lastName: changedUser.lastName}};
          return userModel.findOneAndUpdate({_id: ObjectId(_id)}, userValues);
        },
        login: async (root, {email, password}) => {
          const user = await userModel.findOne({ email: email });
          if (!user){
            throw new Error('No user found with that email');
          }
          const valid = await bcrypt.compare(password, user.password);
          if (!valid){
            throw new Error('Incorrect password ' + password + user.password);
          }
          const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: "1 day" });
          return token;
        }
    }
}

module.exports = resolvers
