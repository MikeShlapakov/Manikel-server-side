const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const customEnv = require('custom-env');

customEnv.env(process.env.NODE_ENV, './config');

const users = require('./routes/users')

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var server = express();

server.use(express.static('public'))
server.use(cors())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(express.json())

// this is the magic
server.use('/api/users', users)

// server.use('/api/users', users)

server.listen(process.env.SERVER_PORT)