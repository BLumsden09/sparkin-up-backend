const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/database')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const authentication = require('./routes/authentication')(router)
const schema = require('./schema')
const expressGraphQL = require('apollo-server-express')
const expressGraphiQL = require('apollo-server-express')

mongoose.Promise = require('bluebird')

mongoose.connect(config.uri, (err) => {
  if (err) {
    console.log('Could NOT connect to database: ', err);
  } else {
    console.log('Connected to database: ' + config.db);
  }
})

app.use(cors({
    origin: 'http://localhost:4200'
}))
app.use(bodyParser.urlencoded({extended: false}))
// app.use(bodyParser.json())

app.use('/authentication', authentication)

app.use('/graphiql', expressGraphiQL.graphiqlExpress({
    endpointURL: '/graphql'
}));

app.use('/graphql', bodyParser.json(), expressGraphQL.graphqlExpress({schema}))

app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Server is up' })
})

app.listen(3333, () => console.log('Listening on port 3333...'))
