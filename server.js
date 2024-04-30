const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const customEnv = require('custom-env');
const bloom = require('./scripts/bloom');
const post = require('./services/posts');

const text = 'Visit https://example.com or http://www.example.org. More links: https://example.net and http://example.io';

(async () => {
    customEnv.env(process.env.NODE_ENV, './config');

    const users = require('./routes/users');
    const posts = require('./routes/posts');
    const tokens = require('./routes/tokens');
    
    // await mongoose.connect(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    console.log(`Successfully connected to MongoDB at ${process.env.MONGO_URL}`);

    await bloom.initBloom();

    const server = express();
    
    server.use(express.static('public'))
    server.use(cors())
    // big enough to handle big images
    server.use(bodyParser.json({ limit: '5mb' }));
    server.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
    server.use(express.json())
    
    // this is the magic
    server.use('/api/users', users)
    
    server.use('/api/posts', posts)
    
    server.use('/api/tokens', tokens)
    
    server.listen(process.env.SERVER_PORT, () => {
        console.log(`Server listening on port ${process.env.SERVER_PORT}`);
    });
})();